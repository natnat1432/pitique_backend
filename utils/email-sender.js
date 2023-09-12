import nodemailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";
import path from "path"; // Import the 'path' module
import dotenv from "dotenv"
dotenv.config();
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export async function sendEmail(email, firstname, password) {
  try {
    // Create a transporter using your email service provider's SMTP settings
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Use __dirname to construct the absolute path to the email template file
    const templatePath = path.join(__dirname, '../email-templates/new-account.ejs');

    // Read the EJS template file
    const template = fs.readFileSync(templatePath, 'utf-8');

    // Compile the template with variables
    const compiledTemplate = ejs.compile(template);
    const html = compiledTemplate({ email, firstname, password });

    // Define email data
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Pitique Account Registration',
      html: html,
    };
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email', error);
    return error.message;
  }
}
