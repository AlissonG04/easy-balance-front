// Conectar ao WebSocket
const socket = io("http://localhost:3000");

// Elementos da página
const pesoDesejadoEl = document.getElementById("peso-desejado");
const pesoAtualEl = document.getElementById("peso-atual");

// Mostrar qual pá carregadeira está logada
const paCarregadeira = localStorage.getItem("paCarregadeira");
document.getElementById(
  "pa-carregadeira"
).innerText = `Pá Carregadeira ${paCarregadeira}`;

// Recuperar complemento aceito
const complementoSelecionado = JSON.parse(
  localStorage.getItem("complementoSelecionado")
);

if (complementoSelecionado) {
  const brutoDesejado =
    Number(complementoSelecionado.tara) + Number(complementoSelecionado.liquid);
  pesoDesejadoEl.innerText = `${brutoDesejado.toFixed(2)} kg`;
} else {
  pesoDesejadoEl.innerText = "-- kg";
}

// Atualizar Peso Atual em tempo real
socket.on("peso-balanca", (data) => {
  if (!data) return;

  // Filtrar pela balança correta
  if (data.balanceId === complementoSelecionado.balance_id) {
    pesoAtualEl.innerText = `${Number(data.peso).toFixed(2)} kg`;
  }
});

// Função para voltar
function voltar() {
  // Limpa o complemento selecionado para evitar bagunça
  localStorage.removeItem("complementoSelecionado");
  window.location.href = "tablet-home.html";
}
