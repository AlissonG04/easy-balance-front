// app.js completo e funcional

document.addEventListener("DOMContentLoaded", function () {
  // Impede acesso direto à tela principal sem login
  if (!localStorage.getItem("usuario")) {
    if (window.location.pathname.includes("principal.html")) {
      window.location.href = "index.html";
      return;
    }
  }

  // Exibe o nome do usuário no topo da tela principal
  const nomeUsuario = localStorage.getItem("usuario");
  const spanNome = document.getElementById("nome-usuario");
  if (nomeUsuario && spanNome) {
    spanNome.textContent = `Olá, ${nomeUsuario}`;
  }

  const botoesComplemento = document.querySelectorAll(".btn.complemento");
  const barraLateral = document.getElementById("barra-lateral");
  const inputTara = document.getElementById("tara");
  const inputLiquidoDesejado = document.getElementById("liquidoDesejado");
  const inputBruto = document.getElementById("bruto");
  const botaoEnviar = document.querySelector(".btn.enviar");
  const mensagem = document.querySelector(".mensagem");
  const botoesParar = document.querySelectorAll(".btn.parar");
  const botaoSair = document.querySelector(".logout-button");
  const loginForm = document.getElementById("loginForm");

  // Lógica da tela de login (se houver formulário)
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nome = document.getElementById("nome").value.trim();
      const sobrenome = document.getElementById("sobrenome").value.trim();

      if (nome && sobrenome) {
        localStorage.setItem("usuario", `${nome} ${sobrenome}`);
        window.location.href = "principal.html";
      } else {
        alert("Por favor, preencha nome e sobrenome.");
      }
    });
  }

  // Função para calcular o Bruto
  function calcularBruto() {
    const tara = parseFloat(inputTara?.value) || 0;
    const liquidoDesejado = parseFloat(inputLiquidoDesejado?.value) || 0;
    if (inputBruto) inputBruto.value = (tara + liquidoDesejado).toFixed(2);
  }

  // Eventos para recalcular o Bruto
  inputTara?.addEventListener("input", calcularBruto);
  inputLiquidoDesejado?.addEventListener("input", calcularBruto);

  // Exibe a barra lateral ao clicar em Complemento
  botoesComplemento.forEach((botao) => {
    botao.addEventListener("click", function (event) {
      event.stopPropagation();
      barraLateral?.classList.add("ativa");
    });
  });

  // Fecha a barra lateral ao clicar fora dela
  document.addEventListener("click", function (event) {
    if (
      barraLateral &&
      !barraLateral.contains(event.target) &&
      !event.target.classList.contains("complemento")
    ) {
      barraLateral.classList.remove("ativa");
    }
  });

  barraLateral?.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  // Enviar complemento
  botaoEnviar?.addEventListener("click", function () {
    if (mensagem) mensagem.style.display = "block";
    if (inputTara) inputTara.value = "";
    if (inputLiquidoDesejado) inputLiquidoDesejado.value = "";
    if (inputBruto) inputBruto.value = "";

    setTimeout(() => {
      if (mensagem) mensagem.style.display = "none";
      barraLateral?.classList.remove("ativa");
    }, 2000);
  });

  // Funcionalidade do botão Parar
  botoesParar.forEach((botao) => {
    botao.addEventListener("click", function () {
      const balanca = botao.closest(".balanca");
      const titulo = balanca?.querySelector(".balanca-titulo")?.textContent;
      if (titulo) alert(`${titulo} foi pausada.`);
    });
  });

  // Funcionalidade do botão Sair
  botaoSair?.addEventListener("click", function () {
    localStorage.removeItem("usuario");
    window.location.href = "../../index.html";
  });
});
