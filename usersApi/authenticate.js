const jwt = require('jsonwebtoken')
const AWS = require('aws-sdk')
const utils = require('../api/utils')
AWS.config.update({ region: 'us-east-1' })
const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.USERS_TABLE

exports.handler = async (event) => {
    try {
        if (!event.authorizationToken) {
            throw new Error('Missing token!')
        }
        const authToken = event.authorizationToken;
        const jwtToken = authToken.replace('Bearer ', '');
        const decoded = jwt.verify(jwtToken, 'JWT_SECRET');
        let params = {
            TableName: tableName,
            FilterExpression: `user_id = :userId`,
            ExpressionAttributeValues: {
                ':userId': decoded.user.user_id
            }
        }
        const userResponse = await dynamodb.scan(params).promise();
        if (userResponse.Items.length > 0) {
            user = userResponse.Items[0];
            const effect = 'Allow'
            const userId = user.name;
            const authorizerContext = { user: JSON.stringify(user) };
            const policyDocument = utils.buildIAMPolicy(userId, effect, event.methodArn, authorizerContext);
            console.log(`${user.email} user authenticated with policy ${policyDocument}`);
            delete user.password;
            event.LoggedInUser = user
            return policyDocument
        } else {
            console.error('No user found!');
            throw new Error('Invalid Credentials!')
        }

    }
    catch (e) {
        return { // Error response
            // statusCode: 401,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            principalId: 'unauthorize',
            body: JSON.stringify({
                error: e.message,
            }),
        };
    }
}

