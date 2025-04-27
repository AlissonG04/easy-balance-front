// assets/js/relatorios.js

document.addEventListener("DOMContentLoaded", () => {
  const tabelaCorpo = document.getElementById("tabelaCorpo");
  const dataInicialInput = document.getElementById("dataInicial");
  const dataFinalInput = document.getElementById("dataFinal");

  let complementos = [];
  const API_URL = "http://localhost:3000/api/complements";
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Sessão expirada. Faça login novamente.");
    window.location.href = "index.html";
  }

  // Função para buscar complementos do back-end
  async function listarComplementos() {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      complementos = await response.json();
      renderizarTabela(complementos);
    } catch (error) {
      console.error("Erro ao buscar complementos:", error);
      alert("Erro ao carregar relatórios.");
    }
  }

  // Renderiza a tabela com complementos
  function renderizarTabela(lista) {
    tabelaCorpo.innerHTML = "";

    if (lista.length === 0) {
      tabelaCorpo.innerHTML = `<tr><td colspan="8" style="text-align:center;">Nenhum registro encontrado.</td></tr>`;
      return;
    }

    lista.forEach((c) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${formatarData(c.created_at)}</td>
        <td>Balança 0${c.balance_id}</td>
        <td>${c.plate}</td>
        <td>${Number(c.tara).toFixed(2)}</td>
        <td>${Number(c.liquid).toFixed(2)}</td>
        <td>${(Number(c.tara) + Number(c.liquid)).toFixed(2)}</td>
        <td>${c.solicitante_username || "N/D"}</td>
        <td>${formatarStatus(c.status)}</td>
      `;
      tabelaCorpo.appendChild(tr);
    });
  }

  // Formatar data
  function formatarData(data) {
    const d = new Date(data);
    return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR");
  }

  // Formatar status
  function formatarStatus(status) {
    if (status === "pendente") return "Pendente";
    if (status === "aceito") return "Aceito";
    if (status === "rejeitado") return "Rejeitado";
    return status;
  }

  // Função de Filtrar
  window.filtrarComplementos = () => {
    const inicial = new Date(dataInicialInput.value);
    const final = new Date(dataFinalInput.value);

    if (!dataInicialInput.value || !dataFinalInput.value) {
      alert("Preencha as duas datas para filtrar.");
      return;
    }

    // Ajusta final para o final do dia
    final.setHours(23, 59, 59, 999);

    const filtrados = complementos.filter((c) => {
      const dataComplemento = new Date(c.created_at);
      return dataComplemento >= inicial && dataComplemento <= final;
    });

    renderizarTabela(filtrados);
  };

  // Exportar para Excel
  window.exportarExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(
      document.getElementById("tabelaComplementos")
    );
    XLSX.utils.book_append_sheet(wb, ws, "Relatorio");
    XLSX.writeFile(wb, "relatorio_complementos.xlsx");
  };

  // Exportar para PDF
  window.exportarPDF = () => {
    const element = document.getElementById("relatorioTabela");
    const opt = {
      margin: 0.5,
      filename: "relatorio_complementos.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };
    html2pdf().from(element).set(opt).save();
  };

  // Logout
  const logoutButton = document.getElementById("logout");
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });

  // Inicializa
  listarComplementos();
});
