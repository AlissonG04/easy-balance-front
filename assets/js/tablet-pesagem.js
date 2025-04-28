const socket = io("http://localhost:3000"); // Ajuste se necessário

const pesoDesejadoElement = document.getElementById("peso-desejado");
const pesoAtualElement = document.getElementById("peso-atual");

// Recuperar o complemento aceito do localStorage
const complemento = JSON.parse(localStorage.getItem("complementoAceito"));

if (!complemento) {
  alert("Nenhum complemento aceito encontrado.");
  window.location.href = "tablet-home.html";
}

// Calcular Peso Desejado (tara + líquido)
const pesoDesejado = (
  Number(complemento.tara) + Number(complemento.liquid)
).toFixed(2);
pesoDesejadoElement.textContent = `${pesoDesejado} kg`;

// Atualizar Peso Atual em tempo real
socket.on("update-weight", (data) => {
  if (data.balanceId === complemento.balance_id) {
    pesoAtualElement.textContent = `${Number(data.weight).toFixed(2)} kg`;
  }
});

// Função para finalizar e voltar para Home
function voltar() {
  if (confirm("Tem certeza que deseja finalizar o complemento?")) {
    localStorage.removeItem("complementoAceito");
    window.location.href = "tablet-home.html";
  }
}
