const registerForm = document.getElementById("registerForm");

console.log("register.js carregado");
console.log("Form encontrado:", registerForm);

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            alert("As senhas não coincidem.");
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

            alert(data.message);

            if (response.ok) {
                window.location.href = "/verify-email";
            }

        } catch (error) {
            console.error("Erro no cadastro:", error);
            alert("Erro ao cadastrar usuário.");
        }
    });
} else {
    console.error("Formulário com id='registerForm' não foi encontrado.");
}