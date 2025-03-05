import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendEmail } from './helper/ses';

import * as _ from 'lodash';
import { CallableContext } from 'firebase-functions/v1/https';
import { InvalidDataException, UnauthenticatedException } from './helper/exceptions';
import { Claims } from './types';
import { appResponse, superAdminRole } from './helper/constants';
import * as generator from 'generate-password';

export const createSuperAdmin = functions.https.onCall(async (data: any) => {
  let responseAppOTP = appResponse();
  try {
    const { email, password } = data;
    if (_.isEmpty(email)) InvalidDataException('Invalid data.');

    const newUser = {
      email: email,
      emailVerified: true,
      password: password,
      disabled: false,
    };

    const userRecord = await admin.auth().createUser(newUser);
    const userId = userRecord.uid;

    let claims: Claims = { role: superAdminRole };
    await admin.auth().setCustomUserClaims(userId, claims);

    await sendEmail({
      email,
      subject: '【Ugoku】Super Admin',
      html: `<p>下記メールアドレスとパスコードを画面に入力してログインしてください。</p><br /><p>メールアドレス：${email}<br />パスワード：${password}</p>`,
    });
    responseAppOTP.data = userId;
    responseAppOTP.status = true;
    responseAppOTP.msg = 'The new admin has been successfully created.';
  } catch (error: any) {
    console.log('createSuperAdmin :>> ', error);
    responseAppOTP.msg = error.message;
    responseAppOTP.code = error.type;
  }
  return responseAppOTP;
});

export const createStoreAccount = functions.https.onCall(async (data: any, context: CallableContext) => {
  let responseAppOTP = appResponse();
  try {
    const { email } = data;
    if (_.isEmpty(email)) InvalidDataException('Invalid data.');
    if (_.isEmpty(context.auth?.uid)) UnauthenticatedException('Not authorized');

    const password = generator.generate({ length: 6 });
    const newUser = {
      email: email,
      emailVerified: true,
      password: password,
      disabled: false,
    };

    const userRecord = await admin.auth().createUser(newUser);

    await sendEmail({
      email,
      subject: '【Ugoku】アカウント登録完了のお知らせ',
      html: `<p>この度は、数あるサービスの中からUgokuをお選びいただき、誠にありがとうございます。</p>
      <p>以下の情報を使用して、パートナー管理画面にログインしていただけます。</p>
      <p>メールアドレス：${email}<br />パスワード：${password}</p>
      <br />
      <p>万が一、ログイン方法や操作に関してご不明点がございましたら、下記サポート窓口までお気軽にお問い合わせください。</p>
      <p>サポート窓口：info@msar.co.jp</p>
      <p>Ugokuサポートチーム一同</p>`,
    });
    responseAppOTP.data = userRecord;
    responseAppOTP.status = true;
    responseAppOTP.msg = 'The new account has been successfully created.';
  } catch (error: any) {
    console.log('createStoreAccount :>> ', error);
    responseAppOTP.msg = error.message;
    responseAppOTP.code = error.type;
  }
  return responseAppOTP;
});
