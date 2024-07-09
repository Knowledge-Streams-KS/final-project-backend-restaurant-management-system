import exphbs from "express-handlebars";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
const sendEmail = async (email, subject, template, data) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const hbs = exphbs.create({
      extname: ".handlebars",
      defaultLayout: false,
      layoutsDir: path.join(__dirname, "views/"),
      partialsDir: path.join(__dirname, "views/"),
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: await hbs.render(path.join(__dirname, `views/${template}`), data),
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

export default sendEmail;
