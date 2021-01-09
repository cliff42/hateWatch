'use strict';

const language = require('@google-cloud/language');

const client = new language.LanguageServiceClient();

exports.analyzeComment = async function (comment) {
  const document = {
    content: comment,
    type: 'PLAIN_TEXT'
  };

  const [result] = await client.analyzeEntitySentiment({ document });
  return result;
};
