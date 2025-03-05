import { EmailService } from "../types";
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "khln.dgl@gmail.com",
    pass: "ptfeeqkedszrebaw",
  },
});

export const sendMail = async (data: EmailService) => {
  const mailOptions = {
    from: "<khln.dgl@gmail.com>",
    to: data.email,
    subject: data.subject,
    html: data.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return;
  } catch (e: any) {
    return e.toString();
  }
};
