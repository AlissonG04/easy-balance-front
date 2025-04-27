// assets/js/tablet-login.js

function login() {
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const paCarregadeira = document.getElementById("paCarregadeira").value.trim();

  if (!usuario || !senha || !paCarregadeira) {
    alert("Preencha todos os campos!");
    return;
  }

  if (isNaN(paCarregadeira)) {
    alert("Pá Carregadeira deve ser um número válido!");
    return;
  }

  // Fazendo login no back-end
  fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: usuario, password: senha }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.token) {
        // Sucesso no login
        localStorage.setItem("token", data.token);
        localStorage.setItem("paCarregadeira", paCarregadeira); // Guardar a pá carregadeira
        localStorage.setItem("usuario", usuario);

        window.location.href = "tablet-home.html";
      } else {
        alert(data.message || "Erro ao fazer login.");
      }
    })
    .catch((error) => {
      console.error("Erro no login:", error);
      alert("Erro ao conectar com o servidor.");
    });
}
