import * as functions from 'firebase-functions';

import * as _ from 'lodash';
import { CallableContext } from 'firebase-functions/v1/https';
import { InvalidDataException } from './helper/exceptions';
import { appResponse } from './helper/constants';
import { sendToTopic } from './helper/notification';

export const sendNotifications = functions.https.onCall(async (data: any, context: CallableContext) => {
  let responseAppOTP = appResponse();
  try {
    const { id, topic, title, body } = data;
    if (_.isEmpty(id) || _.isEmpty(title) || _.isEmpty(body) || _.isEmpty(topic)) InvalidDataException('Invalid data.');
    await sendToTopic(id, title, body, topic);
    responseAppOTP.data = {};
    responseAppOTP.status = true;
    responseAppOTP.msg = 'The notification sent';
  } catch (error: any) {
    console.log('sendNotifications :>> ', error);
    responseAppOTP.msg = error.message;
    responseAppOTP.code = error.type;
  }
  return responseAppOTP;
});
