const AWS = require('aws-sdk')
const moment = require('moment')
const utils = require('./utils')
AWS.config.update({ region: 'us-east-1' })

const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.NOTES_TABLE

exports.handler = async (event) => {
    try {
        let item = JSON.parse(event.body).Item
        const note_id = decodeURIComponent(event.pathParameters.note_id)
        item.user_id = JSON.parse(event.requestContext.authorizer.user).user_id
        item.user_name = utils.getUserName(event.headers)
        item.expires = moment().add(10, 'd').unix()
        const data = await dynamodb.put({
            TableName: tableName,
            Item: item,
            ConditionExpression: `#t = :t & #u = :u`,
            ExpressionAttributeNames: {
                '#t': 'note_id',
                '#u': 'user_id'
            },
            ExpressionAttributeValues: {
                ':t': note_id,
                ':u': item.user_id
            }
        }).promise()
        if (!data) {
            throw new Error('No note found')
        }
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
