// desktop/app.js
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const sobrenome = document.getElementById("sobrenome").value;

  if (nome && sobrenome) {
    // Simula "login" — depois podemos guardar no localStorage ou sessionStorage
    sessionStorage.setItem("usuario", JSON.stringify({ nome, sobrenome }));
    window.location.href = "main.html"; // Aqui será a próxima tela
  }
});
