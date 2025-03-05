import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';

import * as _ from 'lodash';
import { InvalidDataException } from './helper/exceptions';
import { appResponse, superAdminRole } from './helper/constants';
import { connectToDatabase } from './helper/mongo';
import { sendEmail } from './helper/ses';

export const changeAccountPass = functions.https.onCall(async (data: any, context: CallableContext) => {
  let responseStaffPassword = appResponse();
  try {
    const { accountUid, newPassword } = data;
    const callerUid = context!.auth?.uid || '';
    if (_.isEmpty(accountUid) || _.isEmpty(newPassword)) InvalidDataException('Invalid data.');
    if (_.isEmpty(callerUid)) InvalidDataException('Not authorized');

    const callerUserRecord = await admin.auth().getUser(callerUid);
    if (callerUserRecord.customClaims?.role != superAdminRole && accountUid !== callerUid) {
      const db_instance = await connectToDatabase();
      const store = await getStoreData(db_instance, callerUid);
      if (!store.storePrimary) InvalidDataException('Not authorized');
    }

    let email = '';
    if (accountUid !== callerUid) {
      const record = await admin.auth().updateUser(accountUid, { password: newPassword });
      email = record.email || '';
    } else {
      const record = await admin.auth().getUser(accountUid);
      email = record.email || '';
    }
    await sendEmail({
      email,
      subject: '【Ugoku】パスワード変更のご案内',
      html: `<p>いつもUgokuをご利用いただき、誠にありがとうございます。
      お客様のアカウントにおけるパスワードが正常に変更されました。
      この変更に関してご記憶がない場合は、下記のサポート窓口までご連絡くださいますようお願い申し上げます。
      <br />
      サポート窓口：info@msar.co.jp
      Ugokuサポートチーム一同
      </p>`,
    });
    responseStaffPassword.status = true;
    responseStaffPassword.msg = 'Store password has been successfully updated.';
  } catch (error: any) {
    console.log('changeStaffPassword :>> ', error);
    responseStaffPassword.msg = error.message;
    responseStaffPassword.code = error.code;
  }
  return responseStaffPassword;
});

export const changeAccountEmail = functions.https.onCall(async (data: any, context: CallableContext) => {
  let responseStaffEmail = appResponse();
  try {
    const db = await connectToDatabase();
    const { accountUid, newEmail } = data;
    const callerUid = context!.auth?.uid || '';
    if (_.isEmpty(accountUid) || _.isEmpty(newEmail)) InvalidDataException('Invalid data.');
    if (_.isEmpty(callerUid)) InvalidDataException('Not authorized');

    const callerUserRecord = await admin.auth().getUser(callerUid);
    if (callerUserRecord.customClaims?.role != superAdminRole) {
      const store = await getStoreData(db, callerUid);
      if (!store.storePrimary) InvalidDataException('Not authorized');
    }

    const prevRecord = await admin.auth().getUser(accountUid);
    const record = await admin.auth().updateUser(accountUid, { email: newEmail, emailVerified: false });
    const emailResponse = await admin.auth().generateEmailVerificationLink(record.email || '');

    await sendEmail({
      email: record?.email || '',
      subject: '【Ugoku】のメールアドレスの確認',
      html: `<p>この度は、Ugokuをご利用いただき誠にありがとうございます, 
      以下のリンクをクリックしていただくことで、簡単にメールアドレスの確認を行っていただけます。
      お手数をおかけしますが、確認を完了していただけますようお願いいたします。
      <br />
      ${emailResponse} 
      <br />
      なお、この操作に心当たりがない場合は、メールをそのまま破棄していただいて構いません。
      Ugokuサポートチーム一同
      </p>`,
    });
    await sendEmail({
      email: prevRecord?.email || '',
      subject: '【Ugoku】のログイン用メールアドレスが変更されました',
      html: `<p>お客様, <br /><br />Ugoku のログイン用メールアドレスが ${newEmail} に変更されました。<br /><br />この変更に覚えがない場合は Ugoku にご連絡ください。<br /><br />よろしくお願いいたします。<br /><br />Ugoku スタッフ一同</p>`,
    });
    responseStaffEmail.status = true;
    responseStaffEmail.msg = 'Store email has been successfully updated.';
  } catch (error: any) {
    console.log('changeAccountEmail :>> ', error);
    responseStaffEmail.msg = error.message;
    responseStaffEmail.code = error.code;
  }
  return responseStaffEmail;
});

const getStoreData = async (db: any, id: string) => {
  const collection = db.collection('stores');

  const store = await collection.findOne({ _id: id });
  return store;
};
