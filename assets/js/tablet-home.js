// Conectar ao WebSocket
const socket = io("http://localhost:3000");

// Elementos da página
const container = document.getElementById("complementos-container");
const semSolicitacoes = document.getElementById("sem-solicitacoes");

// Recuperar informações do operador
const paCarregadeira = localStorage.getItem("paCarregadeira");
document.getElementById(
  "pa-carregadeira"
).innerText = `Pá Carregadeira ${paCarregadeira}`;

// Token para chamadas autenticadas (se precisar)
const token = localStorage.getItem("token");

// Lista local para controlar complementos
let complementos = [];

// Função de Logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("paCarregadeira");
  localStorage.removeItem("usuario");
  window.location.href = "tablet-login.html";
}

// Função para renderizar os complementos na tela
function renderizarComplementos() {
  container.innerHTML = "";

  if (complementos.length === 0) {
    semSolicitacoes.style.display = "block";
    return;
  }

  semSolicitacoes.style.display = "none";

  complementos
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Mais recentes primeiro
    .forEach((comp) => {
      const card = document.createElement("div");
      card.className = "complemento-card";

      card.innerHTML = `
        <div class="complemento-info"><strong>Balança:</strong> 0${
          comp.balance_id
        }</div>
        <div class="complemento-info"><strong>Placa:</strong> ${
          comp.plate
        }</div>
        <div class="complemento-info"><strong>Tara:</strong> ${Number(
          comp.tara
        ).toFixed(2)} kg</div>
        <div class="complemento-info"><strong>Líquido:</strong> ${Number(
          comp.liquid
        ).toFixed(2)} kg</div>
        <div class="complemento-info"><strong>Bruto:</strong> ${(
          Number(comp.tara) + Number(comp.liquid)
        ).toFixed(2)} kg</div>
        <div class="complemento-info"><strong>Solicitado por:</strong> ${
          comp.solicitante_username || "N/D"
        }</div>
        <div class="complemento-info"><strong>Hora:</strong> ${formatarData(
          comp.created_at
        )}</div>

        <div class="complemento-actions">
          <button class="btn-aceitar" onclick="aceitarComplemento('${
            comp.id
          }')">Aceitar</button>
          <button class="btn-rejeitar" onclick="rejeitarComplemento('${
            comp.id
          }')">Rejeitar</button>
        </div>
      `;

      container.appendChild(card);
    });
}

// Formatar data para exibição
function formatarData(dataISO) {
  const data = new Date(dataISO);
  return data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Aceitar Complemento
function aceitarComplemento(id) {
  const complementoAceito = complementos.find((c) => c.id === id);
  if (complementoAceito) {
    // Armazenar informações para usar na tela de pesagem
    localStorage.setItem(
      "complementoSelecionado",
      JSON.stringify(complementoAceito)
    );

    // Remover da lista local
    complementos = complementos.filter((c) => c.id !== id);
    renderizarComplementos();

    // Redirecionar para tela de pesagem
    window.location.href = "tablet-pesagem.html";
  }
}

// Rejeitar Complemento
function rejeitarComplemento(id) {
  if (confirm("Tem certeza que deseja rejeitar esta solicitação?")) {
    // Informar ao servidor que rejeitou
    fetch(`http://localhost:3000/api/complements/${id}/reject`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          // Remover da lista local
          complementos = complementos.filter((c) => c.id !== id);
          renderizarComplementos();
        } else {
          alert("Erro ao rejeitar complemento.");
        }
      })
      .catch((error) => {
        console.error("Erro ao rejeitar complemento:", error);
        alert("Erro de conexão ao rejeitar complemento.");
      });
  }
}

// Escutar novos complementos em tempo real
socket.on("new-complement", (complemento) => {
  complementos.unshift(complemento); // Adiciona no topo
  renderizarComplementos();
});
