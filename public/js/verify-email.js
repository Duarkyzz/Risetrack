const verifyForm = document.getElementById("verifyForm");
const resendCodeLink = document.getElementById("resendCodeLink");
const verifyMessage = document.getElementById("verifyMessage");

console.log("Script de verificação de email carregado.");

const pendingEmail = localStorage.getItem("pendingEmail");
const emailInput = document.getElementById("email");

function showMessage(message, type) {
    if (!verifyMessage) return;
    verifyMessage.textContent = message;
    verifyMessage.className = `form-message ${type}`;
}

if (pendingEmail && emailInput) {
    emailInput.value = pendingEmail;
}

if (verifyForm) {
    verifyForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        showMessage("", "");

        const email = document.getElementById("email").value.trim();
        const code = document.getElementById("code").value.trim();

        if (!email || !code) {
            showMessage("Preencha o email e o código de verificação.", "error");
            return;
        }

        try {
            const response = await fetch("/verify-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, code })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(data.message, "success");
                localStorage.setItem("loggedUser", JSON.stringify(data.user));
                localStorage.removeItem("pendingEmail");

                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1000);
            } else {
                showMessage(data.message, "error");
            }

        } catch (error) {
            console.error("Erro ao verificar email:", error);
            showMessage("Ocorreu um erro ao verificar o email. Tente novamente.", "error");
        }
    });
} else {
    console.error("Formulário de verificação não encontrado.");
}

if (resendCodeLink) {
    resendCodeLink.addEventListener("click", async (e) => {
        e.preventDefault();

        showMessage("", "");

        const email = document.getElementById("email").value.trim();

        if (!email) {
            showMessage("Por favor, insira seu email para reenviar o código.", "error");
            return;
        }

        try {
            const response = await fetch("/resend-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(data.message, "success");
            } else {
                showMessage(data.message, "error");
            }

        } catch (error) {
            console.error("Erro ao reenviar código:", error);
            showMessage("Ocorreu um erro ao reenviar o código. Tente novamente.", "error");
        }
    });
}