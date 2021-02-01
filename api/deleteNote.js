const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })
const utils = require('./utils')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.NOTES_TABLE

exports.handler = async (event) => {
    try {
        let timestamp = parseInt(event.pathParameters.timestamp)
        let user_id = JSON.parse(event.requestContext.authorizer.user).user_id
        let params = {
            TableName: tableName,
            Key: {
                user_id: user_id,
                timestamp: timestamp
            }
        }
        const data = await dynamodb.delete(params).promise()
        if (!data) {
            throw new Error('No note found')
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "suceess"
            })
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
