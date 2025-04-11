document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("usuario")) {
    if (window.location.pathname.includes("principal.html")) {
      window.location.href = "../../index.html";
      return;
    }
  }

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
  const botoesIniciar = document.querySelectorAll(".btn.iniciar");
  const botaoSair = document.querySelector(".logout-button");
  const loginForm = document.getElementById("loginForm");

  let balancaSelecionada = null;

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nome = document.getElementById("nome").value.trim();
      const sobrenome = document.getElementById("sobrenome").value.trim();

      if (nome && sobrenome) {
        localStorage.setItem("usuario", `${nome} ${sobrenome}`);
        window.location.href = "desktop/principal.html";
      } else {
        alert("Por favor, preencha nome e sobrenome.");
      }
    });
  }

  function calcularBruto() {
    const tara = parseFloat(inputTara?.value) || 0;
    const liquidoDesejado = parseFloat(inputLiquidoDesejado?.value) || 0;
    if (inputBruto) inputBruto.value = (tara + liquidoDesejado).toFixed(2);
  }

  inputTara?.addEventListener("input", calcularBruto);
  inputLiquidoDesejado?.addEventListener("input", calcularBruto);

  botoesComplemento.forEach((botao) => {
    botao.addEventListener("click", function (event) {
      event.stopPropagation();
      barraLateral?.classList.add("ativa");
      balancaSelecionada = botao.dataset.balanca;
    });
  });

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

  botaoEnviar?.addEventListener("click", function () {
    const tara = parseFloat(inputTara?.value) || 0;
    const liquido = parseFloat(inputLiquidoDesejado?.value) || 0;
    const bruto = parseFloat(inputBruto?.value) || 0;

    if (balancaSelecionada) {
      socket.send(
        JSON.stringify({
          tipo: "complemento-envio",
          balanca: balancaSelecionada,
          tara,
          liquido,
          bruto,
        })
      );
    }

    if (mensagem) mensagem.style.display = "block";
    if (inputTara) inputTara.value = "";
    if (inputLiquidoDesejado) inputLiquidoDesejado.value = "";
    if (inputBruto) inputBruto.value = "";

    setTimeout(() => {
      if (mensagem) mensagem.style.display = "none";
      barraLateral?.classList.remove("ativa");
    }, 2000);
  });

  botaoSair?.addEventListener("click", function () {
    localStorage.removeItem("usuario");
    window.location.href = "../../index.html";
  });

  const socket = new WebSocket("ws://localhost:8080");

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);

    if (data.tipo === "peso") {
      const pesoDisplay = document.querySelector(
        `.balanca[data-id="${data.balanca}"] .peso`
      );
      if (pesoDisplay) {
        pesoDisplay.textContent = data.peso;
      }
    }

    if (data.tipo === "historico") {
      const historico = document.querySelector(
        `.balanca[data-id="${data.balanca}"] .historico`
      );
      if (historico) {
        const item = document.createElement("div");
        const horario = new Date(data.data).toLocaleTimeString();
        item.textContent = `${data.peso} kg - ${horario}`;
        historico.appendChild(item);
      }
    }
  };

  botoesParar.forEach((botao) => {
    botao.addEventListener("click", function () {
      const balanca = botao.closest(".balanca")?.getAttribute("data-id");
      const indicador = botao
        .closest(".balanca")
        ?.querySelector("[data-status]");
      if (balanca) {
        socket.send(
          JSON.stringify({ tipo: "controle", acao: "parar", balanca })
        );
      }
      if (indicador) {
        indicador.classList.remove("ativo");
        indicador.classList.add("pausado");
      }
    });
  });

  botoesIniciar.forEach((botao) => {
    botao.addEventListener("click", function () {
      const balanca = botao.closest(".balanca")?.getAttribute("data-id");
      const indicador = botao
        .closest(".balanca")
        ?.querySelector("[data-status]");
      if (balanca) {
        socket.send(
          JSON.stringify({ tipo: "controle", acao: "iniciar", balanca })
        );
      }
      if (indicador) {
        indicador.classList.remove("pausado");
        indicador.classList.add("ativo");
      }
    });
  });
});
