const getUserId = (headers) => {
    return headers.app_userId
}

const getUserName = (headers) => {
    return headers.app_userName
}

const buildIAMPolicy = (userId, effect, resource, context) => {
    console.log(`buildIAMPolicy ${userId} ${effect} ${resource}`);
    const policy = {
        principalId: userId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ],
        },
        context,
    };

    return policy;
};

module.exports = {
    buildIAMPolicy,
    getUserId,
    getUserName
}