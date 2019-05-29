const nodemailer =  require('nodemailer'); // khai báo sử dụng module nodemailer
require('dotenv').config()
const sendMail = (toEmail, code) => {
    const transporter =  nodemailer.createTransport({ // config mail server
        service: 'Gmail',
        auth: {
            user: 'thaole.tranning.nodejs@gmail.com',
            pass: process.env.PASSWORD_EMAIL
        }
    });
    const mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Thao Le',
        to: toEmail,
        subject: 'Code Change Password',
        text: 'You recieved message from ',
        html: '<p>' + code + '</p>'
    }
    return transporter.sendMail(mainOptions);
}
module.exports = sendMail;