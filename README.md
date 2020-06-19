# Serverless Dynamodb With Authentication

This project contains serverless secure nodejs api using dynamodb.
### Prerequistie

 - Install serverless CLI and aws CLI
 - Configure aws ClI with IAM role user credentials with AdministrationAccess

### Installation

To run project locally.

Install the dependencies and devDependencies and start the server.

```sh
$ npm install -d
$ serverless/sls offline
```

To deploy API to aws...

```sh
$ serverless/sls deploy
```

### Plugins

Serverless offline plugin is used to run project locally.