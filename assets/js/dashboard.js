// assets/js/dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout");

  logoutButton.addEventListener("click", () => {
    // Remove o token do localStorage
    localStorage.removeItem("token");

    // Redireciona para a tela de login
    window.location.href = "index.html";
  });
});
