const registerForm = document.getElementById("registerForm");

console.log("register.js carregado");
console.log("Form encontrado:", registerForm);

function showMessage(message, type) {
    registerMessage.textContent = message;
    registerMessage.className = `form-message ${type}`;
}

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        showMessage("", "");

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        confirmPasswordError.textContent = "";

        if (password !== confirmPassword) {
            confirmPasswordError.textContent = "As senhas não coincidem.";
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailRegex.test(email)) {
            showMessage("Digite um email válido.", "error");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

        if (!passwordRegex.test(password)) {
            showMessage(
                "A senha precisa ter no mínimo 8 caracteres, com letra maiúscula, minúscula, número e caractere especial.",
                "error"
            );
            return;
        }

        try {
            const response = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("pendingEmail", email);
                window.location.href = "/verify-email";

                setTimeout(() => {
                    window.location.href = "/verify-email";
                }, 1000);
            
            } else {
                showMessage(data.message, "error");
            
            }

        } catch (error) {
            console.error("Erro no cadastro:", error);
            alert("Erro ao cadastrar usuário.");
        }
    });
} else {
    console.error("Formulário com id='registerForm' não foi encontrado.");
}