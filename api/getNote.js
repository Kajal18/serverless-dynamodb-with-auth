const AWS = require('aws-sdk')
const utils = require('./utils')
AWS.config.update({ region: 'us-east-1' })

const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.NOTES_TABLE

exports.handler = async (event) => {
    try {
        let note_id = decodeURIComponent(event.pathParameters.note_id)
        let user_id = utils.getUserId(event.headers)
        let params = {
            TableName: tableName,
            IndexName: 'note_id-index',
            KeyConditionExpression: `note_id = :uid`,
            ExpressionAttributeValues: {
                ':uid': note_id
            },
            Limit: 1,
        }
        const data = await dynamodb.query(params).promise()
        return {
            statusCode: 200,
            body: data ? JSON.stringify(data.Items[0]) : null
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
