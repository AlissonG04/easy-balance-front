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
  const complemento = JSON.parse(
    localStorage.getItem("complementoSelecionado")
  );
  const token = localStorage.getItem("token");

  if (complemento && token) {
    fetch(`http://localhost:3000/api/complements/${complemento.id}/complete`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          // Após finalizar no back-end, limpar e voltar
          localStorage.removeItem("complementoSelecionado");
          window.location.href = "tablet-home.html";
        } else {
          alert("Erro ao finalizar complemento.");
        }
      })
      .catch((error) => {
        console.error("Erro ao finalizar complemento:", error);
        alert("Erro de conexão ao finalizar complemento.");
      });
  } else {
    window.location.href = "tablet-home.html";
  }
}
