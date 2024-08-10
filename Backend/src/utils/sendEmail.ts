import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, otp: string, p0?: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    await transporter.sendMail(mailOptions);
};
