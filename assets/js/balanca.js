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
    brutoInput.value = bruto.toFixed(2); // Sempre duas casas decimais
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

  // Enviar complemento para o back-end
  complementoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const plate = placaInput.value.trim();
    const tara = parseFloat(taraInput.value);
    const liquido = parseFloat(liquidoInput.value);
    const balanceId = parseInt(balanceIdInput.value);

    if (!plate || isNaN(tara) || isNaN(liquido)) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/api/complements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          balanceId,
          plate,
          tara,
          liquid: liquido,
        }),
      });

      if (response.ok) {
        alert("Solicitação enviada com sucesso!");
        fecharModal();
      } else {
        const errorData = await response.json();
        alert(
          `Erro ao enviar solicitação: ${
            errorData.message || "Erro desconhecido."
          }`
        );
      }
    } catch (error) {
      console.error("Erro ao solicitar complemento:", error);
      alert("Erro ao enviar solicitação.");
    }
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
