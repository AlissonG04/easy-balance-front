// assets/js/balanca.js

document.addEventListener("DOMContentLoaded", () => {
  const modalOverlay = document.getElementById("modalOverlay");
  const complementoForm = document.getElementById("complementoForm");

  const placaInput = document.getElementById("placa");
  const taraInput = document.getElementById("tara");
  const liquidoInput = document.getElementById("liquido");
  const brutoInput = document.getElementById("bruto");
  const balanceIdInput = document.getElementById("balanceId");

  // Atualiza o campo Bruto automaticamente
  function atualizarBruto() {
    const tara = parseFloat(taraInput.value) || 0;
    const liquido = parseFloat(liquidoInput.value) || 0;
    const bruto = tara + liquido;
    brutoInput.value = bruto;
  }

  taraInput.addEventListener("input", atualizarBruto);
  liquidoInput.addEventListener("input", atualizarBruto);

  // Função global para abrir o modal (chamada pelo botão Compl.)
  window.abrirModal = function (balanceId) {
    balanceIdInput.value = balanceId; // Salva qual balança está solicitando complemento
    modalOverlay.style.display = "flex";
    complementoForm.reset();
    brutoInput.value = 0;
  };

  // Função global para fechar o modal
  window.fecharModal = function () {
    modalOverlay.style.display = "none";
  };

  // Enviar complemento (preparado para futura integração)
  complementoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const complementoData = {
      balanceId: parseInt(balanceIdInput.value),
      plate: placaInput.value.trim(),
      tara: parseFloat(taraInput.value),
      liquid: parseFloat(liquidoInput.value),
      gross: parseFloat(brutoInput.value),
    };

    console.log("Dados para envio:", complementoData);

    // Aqui depois vamos fazer o POST para o back-end usando fetch
    fecharModal();
    alert("Solicitação de complemento enviada!");
  });

  // Botão de Logout
  const logoutButton = document.getElementById("logout");
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
});

// Funções de Iniciar/Parar Leitura (placeholder por enquanto)
function iniciarLeitura(balancaId) {
  console.log(`Iniciando leitura da Balança ${balancaId}`);
  // Futuramente: conectar via WebSocket e exibir o peso em tempo real
}

function pararLeitura(balancaId) {
  console.log(`Parando leitura da Balança ${balancaId}`);
  // Futuramente: desconectar WebSocket ou pausar a leitura
}
