document.addEventListener("DOMContentLoaded", function () {
  const botoesComplemento = document.querySelectorAll(".btn.complemento");
  const barraLateral = document.getElementById("barra-lateral");
  const inputTara = document.getElementById("tara");
  const inputLiquidoDesejado = document.getElementById("liquidoDesejado");
  const inputBruto = document.getElementById("bruto");
  const botaoEnviar = document.querySelector(".btn.enviar");
  const mensagem = document.querySelector(".mensagem");

  let balancaAtiva = null;

  // Função para calcular o Bruto
  function calcularBruto() {
    const tara = parseFloat(inputTara.value) || 0;
    const liquidoDesejado = parseFloat(inputLiquidoDesejado.value) || 0;
    inputBruto.value = (tara + liquidoDesejado).toFixed(2);
  }

  // Adiciona eventos de input para recalcular o Bruto
  inputTara.addEventListener("input", calcularBruto);
  inputLiquidoDesejado.addEventListener("input", calcularBruto);

  // Exibe a barra lateral ao clicar no botão "Complemento" correspondente
  botoesComplemento.forEach(function (botao) {
    botao.addEventListener("click", function (event) {
      event.stopPropagation(); // Impede que o clique se propague para o document
      balancaAtiva = botao.closest(".balanca");
      barraLateral.classList.add("ativa");
    });
  });

  // Fecha a barra lateral ao clicar fora dela
  document.addEventListener("click", function (event) {
    if (
      !barraLateral.contains(event.target) &&
      barraLateral.classList.contains("ativa")
    ) {
      barraLateral.classList.remove("ativa");
      balancaAtiva = null;
    }
  });

  // Impede que cliques dentro da barra lateral fechem ela
  barraLateral.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  // Mostra a mensagem ao clicar no botão "Enviar Complemento"
  botaoEnviar.addEventListener("click", function () {
    mensagem.style.display = "block";
    setTimeout(() => {
      mensagem.style.display = "none";
      barraLateral.classList.remove("ativa");
      balancaAtiva = null;
    }, 3000); // A mensagem será exibida por 3 segundos
  });
});
