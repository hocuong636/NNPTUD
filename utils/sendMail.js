const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 25,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: "fc38bf675755a3",
        pass: "d2c0092fa75456",
    },
});

module.exports = {
    sendMail: async function (to, url) {
        await transporter.sendMail({
            from: 'admin@haha.com',
            to: to,
            subject: "reset password email",
            text: "click vao day de doi pass", // Plain-text version of the message
            html: "click vao <a href=" + url + ">day</a> de doi pass", // HTML version of the message
        })
    },
    sendPasswordMail: async function (to, username, password) {
        await transporter.sendMail({
            from: 'admin@haha.com',
            to: to,
            subject: "Thông tin tài khoản của bạn",
            text: `Xin chào ${username},\nTài khoản của bạn đã được tạo.\nUsername: ${username}\nPassword: ${password}\nVui lòng đổi mật khẩu sau khi đăng nhập.`,
            html: `
                <h2>Xin chào ${username},</h2>
                <p>Tài khoản của bạn đã được tạo thành công.</p>
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>Password:</strong> ${password}</p>
                <p style="color: red;"><em>Vui lòng đổi mật khẩu sau khi đăng nhập.</em></p>
            `,
        })
    }
}

