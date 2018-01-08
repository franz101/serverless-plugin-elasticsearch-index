import path from 'path';
import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import transformRecord from '../lib/transform';

const xml2js = require('xml2js');

// Destination bucket
const { BUCKET } = process.env;

export const handler = (event, context, callback) => {
  /*
   * Some checks here before going any further
   */

  // Only work on the first record
  const snsRecord = event.Records ? event.Records[0] : undefined;

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return callback('Bad record');
  }

  /*
   * Prepare file analysis
   */

  // Extract message
  const message = JSON.parse(snsRecord.Sns.Message);

  // Check file extension
  if (path.extname(message.object.key) !== '.xml') {
    return callback('File extension should be .xml');
  }

  /*
   * Prepare the SNS message
   */

  // Get Account ID from lambda function arn in the context
  const accountId = context.invokedFunctionArn.split(':')[4];

  // Get stage and region from environment variables
  const stage = process.env.STAGE;
  const region = process.env.REGION;

  // Get the endpoint arn
  const endpointArn = `arn:aws:sns:${region}:${accountId}:${stage}-etl-`;
  const sns = new AWS.SNS();

  const handleError = e =>
    sns.publish(
      {
        Message: JSON.stringify({
          default: JSON.stringify({
            object: message.object.key,
            message: e,
          }),
        }),
        MessageStructure: 'json',
        TargetArn: `${endpointArn}failure`,
      },
      snsErr => {
        if (snsErr) {
          return callback(snsErr);
        }

        return callback(e);
      }
    );

  const s3 = new AWS.S3();

  // Get file
  const file = s3
    .getObject({
      Bucket: message.bucket.name,
      Key: message.object.key,
    })
    .createReadStream();

  // Put data in buffer
  const buffers = [];
  file.on('data', data => {
    buffers.push(data);
  });

  file.on('error', handleError);

  // Manage data
  file.on('end', () => {
    let dataString = '';

    try {
      // Parse file
      const buffer = Buffer.concat(buffers);

      const parser = xml2js.Parser();
      parser.parseString(buffer, (err, result) => {
        if (result.main && result.main.DATA_RECORD) {
          const res = result.main.DATA_RECORD;
          for (let i = 0; i < res.length; i += 1) {
            // Transform data
            const data = transformRecord(res[i]);
            dataString += `${JSON.stringify(data)}\n`;
          }
        }
      });
    } catch (e) {
      return handleError(e.message);
    }

    // Load data
    const params = {
      Bucket: BUCKET,
      Key: `${message.object.key}.ndjson`,
      Body: dataString,
      ContentType: 'application/x-ndjson',
    };

    return s3.upload(params, err => {
      if (err) {
        return handleError(err);
      }

      // Publish message to ETL Success topic

      /*
       * Send the SNS message
       */
      return sns.publish(
        {
          Message: JSON.stringify({
            default: JSON.stringify({
              object: message.object.key,
              message: 'ETL successful',
            }),
          }),
          MessageStructure: 'json',
          TargetArn: `${endpointArn}success`,
        },
        snsErr => {
          if (snsErr) {
            return callback(snsErr);
          }

          return callback(null, 'XML file has been parsed');
        }
      );
    });
  });

  return file;
};

export default handler;