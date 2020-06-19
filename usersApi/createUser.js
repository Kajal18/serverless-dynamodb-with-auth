const AWS = require('aws-sdk')
const uuid = require('uuid').v4
const moment = require('moment')
const bcrypt = require('bcryptjs')
AWS.config.update({ region: 'us-east-1' })

const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.USERS_TABLE

exports.handler = async (event) => {
    try {
        let item = JSON.parse(event.body).Item
        item.user_id = uuid()
        item.user_name = item.user_name
        item.password = bcrypt.hashSync(item.password, 8);
        item.timestamp = moment().unix()
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
