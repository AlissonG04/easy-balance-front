document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nome = document.getElementById("nome").value.trim();
      const sobrenome = document.getElementById("sobrenome").value.trim();

      if (nome && sobrenome) {
        localStorage.setItem("usuario", `${nome} ${sobrenome}`);
        window.location.href = "pages/desktop/principal.html";
      } else {
        alert("Por favor, preencha nome e sobrenome.");
      }
    });
  }
});
