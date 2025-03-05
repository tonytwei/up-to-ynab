// lambda.js
const serverlessExpress = require('@codegenie/serverless-express')
const app = require('./route').default; // Use `.default` because of ES module export

exports.handler = serverlessExpress({ app: app.callback() }); // Wrap Koa app