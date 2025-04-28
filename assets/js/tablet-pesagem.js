// assets/js/tablet-pesagem.js

const socket = io("http://localhost:3000"); // Ajuste se necessário

// Elementos
const pesoDesejadoElement = document.getElementById("peso-desejado");
const pesoAtualElement = document.getElementById("peso-atual");

// Recupera o complemento aceito
const complemento = JSON.parse(localStorage.getItem("complementoAceito"));

if (!complemento) {
  alert("Nenhum complemento aceito encontrado.");
  window.location.href = "tablet-home.html";
}

// Calcular o Peso Desejado = Tara + Líquido
const pesoDesejado = (
  Number(complemento.tara) + Number(complemento.liquid)
).toFixed(2);
pesoDesejadoElement.textContent = `${pesoDesejado} kg`;

// Atualizar Peso Atual em tempo real
socket.on("update-weight", (data) => {
  // Você vai precisar garantir que o dado recebido é da balança correta
  if (data.balanceId === complemento.balance_id) {
    pesoAtualElement.textContent = `${Number(data.weight).toFixed(2)} kg`;
  }
});

// Função de Voltar
function voltar() {
  if (confirm("Tem certeza que deseja finalizar o complemento?")) {
    localStorage.removeItem("complementoAceito");
    window.location.href = "tablet-home.html";
  }
}
