const AWS = require('aws-sdk')
const utils = require('./utils')
const uuid = require('uuid').v4
const moment = require('moment')
AWS.config.update({ region: 'us-east-1' })

const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.NOTES_TABLE

exports.handler = async (event) => {
    try {
        let item = JSON.parse(event.body).Item
        item.user_id = JSON.parse(event.requestContext.authorizer.user).user_id
        item.user_name = utils.getUserName(event.headers)
        item.note_id = item.user_id + ':' + uuid()
        item.timestamp = moment().unix()
        item.expires = moment().add(10, 'd').unix()
        const data = await dynamodb.put({
            TableName: tableName,
            Item: item
        }).promise()
        return {
            statusCode: 200,
            body: JSON.stringify(item)

        }
    } catch (err) {
        console.log('Eroro', err)
        return {
            statuscode: err.statusCode ? err.statusCode : 500,
            body: JSON.stringify({
                error: err.message ? err.message : 'Something went wrong!'
            })
        }
    }
}
