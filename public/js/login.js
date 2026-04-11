const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById("loginMessage")

function showMessage(message, type){
    if (!loginMessage) return;
    loginMessage.textContent = message;
    loginMessage.className = `form-message ${type}`;
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        showMessage("", "");
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
   
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
    
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('loggedUser', JSON.stringify(data.user));

            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1000)

        } else {
            showMessage(data.message, "error");
        }
            
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente mais tarde.');
    }
    });

} else {
    console.error("Formulário de login não encontrado");
}
