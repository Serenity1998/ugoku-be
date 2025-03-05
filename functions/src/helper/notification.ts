import * as admin from 'firebase-admin';

export const sendToDevices = async (title: string, body: string, tokens = [] as string[], data = {}) => {
  if (tokens.length === 0) return;

  let message = {
    tokens: tokens,
    notification: {
      title: title,
      body: body,
    },
    android: {},
    apns: {},
    data,
  };
  const response = await admin.messaging().sendEachForMulticast(message);
  console.log(response.successCount + ' messages were sent successfully');
};

export const sendToTopic = async (id: string, title: string, body: string, topic: string, data = {}) => {
  let foregroundMessage = {
    topic: topic,
    notification: {
      title: title,
      body: body,
    },
    data: {
      click_action: 'FLUTTER_NOTIFICATION_CLICK',
      id: id,
      status: 'done',
      notification_id: id,
      save: 'true',
    },
    android: {
      priority: 'high' as 'high',
    },
    apns: {
      headers: {
        'apns-push-type': 'alert',
        'apns-priority': '10',
      },
      payload: {
        aps: {
          alert: {
            title: title,
            body: body,
          },
          sound: 'default',
        },
      },
    },
  };
  let backgroundMessage = {
    topic: topic,
    data: {
      click_action: 'FLUTTER_NOTIFICATION_CLICK',
      id: id,
      status: 'done',
      notification_id: id,
      save: 'true',
    },
    android: {
      priority: 'high' as 'high',
    },
    apns: {
      headers: {
        'apns-priority': '5',
        'apns-push-type': 'background',
        'apns-topic': 'io.flutter.plugins.firebase.messaging',
      },
      payload: {
        aps: {
          'content-available': 1,
        },
      },
    },
  };
  await admin.messaging().send(backgroundMessage);
  await admin.messaging().send(foregroundMessage);
  console.log('Successfully sent message');
};
