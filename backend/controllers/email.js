const User = require('../models/user');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
});

exports.sendChangePasswordEmail = (req, res, next) => {
    console.log('---GỬI EMAIL THAY ĐỔI MẬT KHẨU---');
    const { email, phone, name, title, text, code } = req.msg;
    if (!email && phone) {
        next();
    } else if (!email && !phone) {
        console.log('---KHÔNG CUNG CẤP EMAIL---');
    } else {
        transport
            .sendMail({
                from: process.env.ADMIN_EMAIL,
                to: email,
                subject: `Thương mại điện tử ShoeGarden - ${title}`,
                html: `<div>
                    <h2>ShoeGarden!</h2>
                    <h1>${title}</h1>
                    <p>Chào ${name},</p>
                    <p>Cảm ơn bạn đã lựa chọn ShoeGarden.</p>
                    <p>${text}</p>
                    ${
                        code
                            ? `<button style="background-color:#0d6efd; border:none; border-radius:4px; padding:0;">
                            <a
                                style="color:#fff; text-decoration:none; font-size:16px; padding: 16px 32px; display: inline-block;"
                                href='http://localhost:${process.env.CLIENT_PORT_2}/change/password/${code}'
                            >
                           Thay đổi mật khẩu!
                            </a>
                        </button>
                        `
                            : ''
                    }
                </div>`,
            })
            .then(() => {
                console.log('---GỬI EMAIL THÀNH CÔNG---');
            })
            .catch((error) => {
                console.log('---GỬI EMAIL THẤT BẠI---', error);
            });
    }
};

