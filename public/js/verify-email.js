const verifyForm = document.getElementById("verifyForm");
const resendCodeLink = document.getElementById("resendCodeLink");

console.log("Script de verificação de email carregado.");

const pendingEmail = localStorage.getItem("pendingEmail");
const emailInput = document.getElementById("email");

if (pedingEmail && emailInput) {
    emailInput.value = pedingEmail;
}

if (verifyForm) {
    verifyForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const code = document.getElementById("code").value.trim();

                try {
                    const response = await fetch("/verify-email", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ email, code })
                    });
        
                    const data = await response.json();

                    alert(data.message);

                    if (response.ok) {
                        localStorage.removeItem("loggedUser", JSON.stringify(data.user));
                        localStorage.removeItem("pendingEmail");
                        window.location.href = "/";
                    }
                } catch (error) {
                    console.error("Erro ao verificar email:", error);
                    alert("Ocorreu um erro ao verificar o email. Tente novamente.");
                }
            });
        } else {
            console.error("Formulário de verificação não encontrado.");
        }

        if (resendCodeLink) {
            resendCodeLink.addEventListener("click", async (e) => {
                e.preventDefault();

                const email = document.getElementById("email").value.trim();

                if (!email) {
                    alert("Por favor, insira seu email para reenviar o código.");
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
                    alert(data.message);

                } catch (error) {
                    console.error("Erro ao reenviar código:", error);
                    alert("Ocorreu um erro ao reenviar o código. Tente novamente.");
                }
            });
    }
 