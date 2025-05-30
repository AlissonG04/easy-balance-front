// assets/js/tablet-home.js

const socket = io("http://localhost:3000"); // Ajuste se necessário
const container = document.getElementById("complementos-container");
const semSolicitacoes = document.getElementById("sem-solicitacoes");
const paCarregadeira = document.getElementById("pa-carregadeira");

// Recupera a pá carregadeira do localStorage
const pa = localStorage.getItem("paCarregadeira") || "Desconhecida";
paCarregadeira.textContent = `Pá Carregadeira ${pa}`;

// Lista de complementos pendentes
let complementos = [];

// Renderizar complementos
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
      const idComp = comp.id || comp._id;

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
        <div class="complemento-info"><strong>Solicitado por:</strong> ${
          comp.solicitante_username || "N/D"
        }</div>
        <div class="complemento-info"><strong>Hora:</strong> ${new Date(
          comp.created_at
        ).toLocaleTimeString("pt-BR")}</div>

        <div class="complemento-actions">
          <button class="btn-aceitar" onclick="aceitarComplemento('${idComp}')">Aceitar</button>
          <button class="btn-rejeitar" onclick="rejeitarComplemento('${idComp}')">Rejeitar</button>
        </div>
      `;

      container.appendChild(card);
    });
}

// Receber novos complementos via WebSocket
socket.on("new-complement", (data) => {
  complementos.push(data);
  renderizarComplementos();
});

// Função para aceitar complemento
function aceitarComplemento(id) {
  const complemento = complementos.find((c) => (c.id || c._id) === id);

  if (!complemento) {
    showToast("Complemento não encontrado.");
    return;
  }

  // Salva no localStorage
  localStorage.setItem("complementoAceito", JSON.stringify(complemento));

  // Remove da lista e atualiza tela
  complementos = complementos.filter((c) => (c.id || c._id) !== id);
  renderizarComplementos();

  // Redireciona para a tela de pesagem
  window.location.href = "tablet-pesagem.html";
}

// Função para rejeitar complemento
function rejeitarComplemento(id) {
  if (confirm("Tem certeza que deseja rejeitar esta solicitação?")) {
    complementos = complementos.filter((c) => (c.id || c._id) !== id);
    renderizarComplementos();
    showToast("Solicitação rejeitada.");
  }
}

// Função para mostrar Toast
function showToast(mensagem) {
  const toast = document.getElementById("toast");
  if (!toast) return; // Protege caso toast não exista
  toast.textContent = mensagem;
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}

// Função de Logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("paCarregadeira");
  localStorage.removeItem("complementoAceito");
  window.location.href = "tablet-login.html";
}
