// assets/js/script.js

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const errorDiv = document.getElementById("error");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Captura dados do formulário
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Limpa mensagens de erro anteriores
    errorDiv.textContent = "";

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login bem-sucedido
        localStorage.setItem("token", data.token); // Salva token no navegador
        window.location.href = "dashboard.html"; // Redireciona para a dashboard (tela principal)
      } else {
        // Login falhou
        errorDiv.textContent = data.message || "Erro no login.";
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      errorDiv.textContent = "Erro no servidor. Tente novamente.";
    }
  });
});
