import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ✅ Nova função para enviar código de verificação
export const sendVerificationCodeEmail = async (toEmail: string, code: string) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: toEmail,
        subject: 'Seu Código de Verificação EventPro',
        html: `
            <p>Olá,</p>
            <p>Seu código de verificação para o EventPro é: <strong>${code}</strong></p>
            <p>Este código expira em 5 minutos. Por favor, insira-o no aplicativo para verificar seu e-mail.</p>
            <p>Se você não solicitou isso, por favor, ignore este e-mail.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Código de verificação enviado para ${toEmail}`);
    } catch (error) {
        console.error(`Erro ao enviar código de verificação para ${toEmail}:`, error);
        throw new Error('Não foi possível enviar o código de verificação.');
    }
};

// Função existente para redefinição de senha (mantém link por simplicidade)
export const sendResetPasswordEmail = async (toEmail: string, resetUrl: string) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: toEmail,
        subject: 'Redefinição de Senha do EventPro',
        html: `
            <p>Olá,</p>
            <p>Você solicitou a redefinição de sua senha. Por favor, clique no link abaixo para redefinir sua senha:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>Este link expirará em 1 hora. Se você não solicitou isso, por favor, ignore este e-mail.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`E-mail de redefinição de senha enviado para ${toEmail}`);
    } catch (error) {
        console.error(`Erro ao enviar e-mail de redefinição de senha para ${toEmail}:`, error);
        throw new Error('Não foi possível enviar o e-mail de redefinição de senha.');
    }
};