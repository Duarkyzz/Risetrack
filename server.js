require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const enviarCodigo = require("./mailer");

const app = express();
const PORT = process.env.PORT || 3000;

const usersFile = path.join(__dirname, "users.json");

// Middleware para parsear JSON e dados de formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Garantir que users.json exista

if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([]));
}

// Função para gerar um ID único para cada usuário

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, "public")));

// Rotas das páginas
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

app.get("/verify-email", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "verify-email.html"));
});

// Cadastro

app.post("/register", async (req, res ) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });
  }

  const users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));

  const usersExists = users.find(user => user.email === email);

  if (usersExists) {
    return res.status(400).json({ message: "Email já cadastrado." });
  }

  const verificationCode = generateVerificationCode();
  
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    verified: false,
    verificationCode
  };

  users.push(newUser);
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf-8");

  await enviarCodigo(email, verificationCode);

  console.log(`Código de verificação para ${email}: ${verificationCode}`);

  res.status(201).json({ message: "Conta criada com sucesso!! Verifique seu e-mail." });
});

// Verificação de email

app.post("/verify-email", (req, res) => {
  const { email, code } = req.body;

  let users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));

  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(400).json({ message: "Usuário não encontrado." });
  }

  if (user.verificationCode !== code) {
    return res.status(400).json({ message: "Código de verificação inválido." });
  }

  user.verified = true;
  user.verificationCode = null;

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf-8");

  return res.status(200).json ({
    message: "Email verificado com sucesso! Agora você pode fazer login.",
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

// Login

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));

  const user = users.find(user => user.email === email && user.password === password);

  if (user) {
    return res.status(401).json({ message: "Email ou senha inválidos." });
  }

  res.status(200).json({
    message: "Login bem-sucedido.",
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Reenviar código de verificação

app.post("/resend-code", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email é obrigatório." });
  }

  let users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));

  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(400).json({ message: "Usuário não encontrado." });
  }

  if (user.verified) {
    return res.status(400).json({ message: "Email já verificado." });
  }

  const newCode = generateVerificationCode();
  user.verificationCode = newCode;

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf-8");

  console.log(`Novo código de verificação para ${email}: ${newCode}`);

  return res.status(200).json({
    message: "Novo código de verificação enviado! Verifique seu email."
  });
});