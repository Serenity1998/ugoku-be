export type EmailService = {
  email: string;
  html: string;
  subject: string;
};

export interface Claims {
  [key: string]: string;
}
