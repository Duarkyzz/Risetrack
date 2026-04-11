const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function enviarCodigo(email, codigo){
    try {
        await transporter.sendMail({
            from: `"Risetrack" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Código de Verificação',
            text: `Seu código de verificação é: ${codigo}`
        });
        console.log("email enviado");
    } catch (err) {
        console.error("Erro ao enviar email:", err);
    }
}

module.exports = enviarCodigo;