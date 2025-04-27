// assets/js/usuarios.js

document.addEventListener("DOMContentLoaded", () => {
  const usuariosTableBody = document.getElementById("usuariosTableBody");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const usuarioForm = document.getElementById("usuarioForm");
  const userIdInput = document.getElementById("userId");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const roleInput = document.getElementById("role");
  const confirmModalOverlay = document.getElementById("confirmModalOverlay");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");

  let usuarios = [];
  let userIdParaExcluir = null;
  const API_URL = "http://localhost:3000/api/users";
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Sessão expirada. Faça login novamente.");
    window.location.href = "index.html";
  }

  // Função para buscar usuários da API
  async function listarUsuarios() {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      usuarios = await response.json();
      renderizarUsuarios();
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      alert("Erro ao carregar usuários.");
    }
  }

  // Renderiza os usuários na tabela
  function renderizarUsuarios() {
    usuariosTableBody.innerHTML = "";

    usuarios.forEach((user) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
          <td>${user.username}</td>
          <td>${formatarTipo(user.role)}</td>
          <td>${formatarData(user.created_at)}</td>
          <td>
            <button class="btn azul" onclick="abrirModalEditar(${
              user.id
            })">Editar</button>
            <button class="btn vermelho" onclick="confirmarExclusao(${
              user.id
            })">Excluir</button>
          </td>
        `;
      usuariosTableBody.appendChild(tr);
    });
  }

  // Helper: formatar tipo
  function formatarTipo(role) {
    if (role === "admin") return "Administrador";
    if (role === "operador") return "Operador";
    if (role === "desktop") return "Desktop";
    return role;
  }

  // Helper: formatar data
  function formatarData(data) {
    const d = new Date(data);
    return d.toLocaleDateString("pt-BR");
  }

  // Abrir modal para novo usuário
  window.abrirModalNovo = function () {
    modalTitle.textContent = "Novo Usuário";
    usuarioForm.reset();
    userIdInput.value = "";
    modalOverlay.style.display = "flex";
  };

  // Abrir modal para editar usuário
  window.abrirModalEditar = async function (id) {
    try {
      const user = usuarios.find((u) => u.id === id);
      if (!user) return;

      modalTitle.textContent = "Editar Usuário";
      userIdInput.value = user.id;
      usernameInput.value = user.username;
      passwordInput.value = ""; // senha nunca vem do back-end
      roleInput.value = user.role;

      modalOverlay.style.display = "flex";
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      alert("Erro ao abrir usuário para edição.");
    }
  };

  // Fechar modal de Novo/Editar
  window.fecharModal = function () {
    modalOverlay.style.display = "none";
  };

  // Mostrar/Ocultar Senha
  window.toggleSenha = function () {
    const tipo =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", tipo);
  };

  // Abrir modal de confirmação
  window.confirmarExclusao = function (id) {
    userIdParaExcluir = id;
    confirmModalOverlay.style.display = "flex";
  };

  // Confirmar exclusão
  confirmYes.addEventListener("click", async () => {
    if (userIdParaExcluir !== null) {
      try {
        await fetch(`${API_URL}/${userIdParaExcluir}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Usuário excluído com sucesso!");
        await listarUsuarios();
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        alert("Erro ao excluir usuário.");
      } finally {
        confirmModalOverlay.style.display = "none";
        userIdParaExcluir = null;
      }
    }
  });

  // Cancelar exclusão
  confirmNo.addEventListener("click", () => {
    userIdParaExcluir = null;
    confirmModalOverlay.style.display = "none";
  });

  // Salvar usuário (Novo ou Editar)
  usuarioForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = userIdInput.value;
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleInput.value;

    if (!username || !role || (!id && !password)) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      if (id) {
        // Atualizar usuário
        await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, password, role }),
        });
        alert("Usuário atualizado com sucesso!");
      } else {
        // Criar novo usuário
        await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, password, role }),
        });
        alert("Usuário criado com sucesso!");
      }

      listarUsuarios();
      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      alert("Erro ao salvar usuário.");
    }
  });

  // Logout
  const logoutButton = document.getElementById("logout");
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });

  // Inicializar
  listarUsuarios();
});
