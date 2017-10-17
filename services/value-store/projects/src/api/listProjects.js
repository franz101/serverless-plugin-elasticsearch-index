import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

export const handler = (event, context, callback) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    convertEmptyValues: true,
  });

  const { TABLE } = process.env;

  const params = {
    TableName: TABLE,
    ProjectionExpression:
      'project_id, title, timeframe, eu_budget_contribution, description',
  };

  const projects = [];

  function onScan(isRoot) {
    return (err, data) => {
      if (err) {
        callback(err);
      } else {
        data.Items.forEach(project => {
          projects.push(project);
        });

        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey !== 'undefined') {
          params.ExclusiveStartKey = data.LastEvaluatedKey;
          documentClient.scan(params, onScan(false));
        }

        if (isRoot) {
          const response = {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*', // Required for CORS support to work
              'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify(projects),
          };

          callback(null, response);
        }
      }
    };
  }

  return documentClient.scan(params, onScan(true));
};

export default handler;
