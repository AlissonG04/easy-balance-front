// Conecta ao servidor WebSocket
const socket = new WebSocket("ws://localhost:8080");

const mensagemInicial = document.getElementById("mensagem-inicial");
const solicitacao = document.getElementById("solicitacao");
const acompanhamento = document.getElementById("acompanhamento");
const balancaIdSpan = document.getElementById("balanca-id");
const brutoDesejadoSpan = document.getElementById("bruto-desejado");
const brutoFinalSpan = document.getElementById("bruto-final");
const pesoAtualSpan = document.getElementById("peso-atual");

let balancaAtual = null;
let acompanhamentoAtivo = false;

socket.onopen = () => {
  console.log("WebSocket conectado no tablet.");
};

socket.onerror = (err) => {
  console.error("Erro no WebSocket:", err);
};

socket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  console.log("Dados recebidos via WebSocket:", data);

  if (data.tipo === "complemento") {
    mensagemInicial.style.display = "none";
    solicitacao.style.display = "block";
    acompanhamento.style.display = "none";

    balancaIdSpan.textContent = data.balanca;
    brutoDesejadoSpan.textContent = data.bruto;
    brutoFinalSpan.textContent = data.bruto;

    balancaAtual = data.balanca.padStart(2, "0");
    acompanhamentoAtivo = false;
  }

  if (
    data.tipo === "peso" &&
    acompanhamentoAtivo &&
    data.balanca === balancaAtual
  ) {
    console.log(`Atualizando peso da balança ${data.balanca}: ${data.peso}`);
    pesoAtualSpan.textContent = data.peso;
  }
};

const aceitarBtn = document.getElementById("aceitar");
aceitarBtn.addEventListener("click", () => {
  console.log("Clique no botão Aceitar detectado");

  socket.send(
    JSON.stringify({
      tipo: "resposta-complemento",
      acao: "aceitar",
      balanca: balancaAtual,
    })
  );

  solicitacao.style.display = "none";
  acompanhamento.style.display = "block";
  acompanhamentoAtivo = true;
});

const recusarBtn = document.getElementById("recusar");
recusarBtn.addEventListener("click", () => {
  console.log("Clique no botão Recusar detectado");

  socket.send(
    JSON.stringify({
      tipo: "resposta-complemento",
      acao: "recusar",
      balanca: balancaAtual,
    })
  );

  solicitacao.style.display = "none";
  mensagemInicial.style.display = "block";
  acompanhamentoAtivo = false;
  balancaAtual = null;
});

const finalizarBtn = document.getElementById("finalizar");
finalizarBtn.addEventListener("click", () => {
  console.log("Complemento finalizado pelo operador");
  acompanhamento.style.display = "none";
  mensagemInicial.style.display = "block";
  acompanhamentoAtivo = false;
  balancaAtual = null;
});
