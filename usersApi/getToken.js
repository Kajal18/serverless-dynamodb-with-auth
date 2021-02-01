const jwt = require('jsonwebtoken')
const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })
const bcrypt = require('bcryptjs')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.USERS_TABLE

exports.handler = async (event) => {
    try {
        let response
        const { email, password } = JSON.parse(event.body)
        if (!email || !password) {
            throw new Error('Missing credentials!')
        }
        const userResponseData = await dynamodb.scan({
            TableName: tableName,
            FilterExpression: 'email= :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        }).promise();
        if (!userResponseData.Items.length) {
            throw new Error('Invalid Credentials!')
        }
        user = userResponseData.Items[0];
        if (user) {
            const isSamePassword = await bcrypt.compare(password, user.password);
            if (isSamePassword) {
                const token = jwt.sign({ user }, 'JWT_SECRET');
                delete user.password;
                response = { // Success response
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({
                        token,
                    }),
                };
            } else {
                throw new Error('Invalid username or password')
            }
        } else {
            throw new Error('Invalid Credentials!')
        }
        return response
    }
    catch (e) {
        return { // Error response
            statusCode: 401,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: e.message,
            }),
        };
    }
}

