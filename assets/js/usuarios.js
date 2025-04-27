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

  // Lista simulada de usuários
  let usuarios = [
    { id: 1, username: "Jhon Doe", role: "operador", createdAt: "2025-04-23" },
    { id: 2, username: "Jane Doe", role: "admin", createdAt: "2025-04-23" },
    { id: 3, username: "Alisson", role: "desktop", createdAt: "2025-04-23" },
  ];

  // Função para listar usuários na tabela
  function listarUsuarios() {
    usuariosTableBody.innerHTML = "";

    usuarios.forEach((user) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
          <td>${user.username}</td>
          <td>${formatarTipo(user.role)}</td>
          <td>${formatarData(user.createdAt)}</td>
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

  // Helper para formatar o tipo de usuário
  function formatarTipo(role) {
    if (role === "admin") return "Administrador";
    if (role === "operador") return "Operador";
    if (role === "desktop") return "Desktop";
    return role;
  }

  // Helper para formatar a data
  function formatarData(data) {
    const d = new Date(data);
    return d.toLocaleDateString("pt-BR");
  }

  // Abre modal para criar novo usuário
  window.abrirModalNovo = function () {
    modalTitle.textContent = "Novo Usuário";
    usuarioForm.reset();
    userIdInput.value = "";
    modalOverlay.style.display = "flex";
  };

  // Abre modal para editar usuário
  window.abrirModalEditar = function (id) {
    const user = usuarios.find((u) => u.id === id);
    if (!user) return;

    modalTitle.textContent = "Editar Usuário";
    userIdInput.value = user.id;
    usernameInput.value = user.username;
    passwordInput.value = ""; // Não carregamos senha antiga
    roleInput.value = user.role;

    modalOverlay.style.display = "flex";
  };

  // Fecha o modal
  window.fecharModal = function () {
    modalOverlay.style.display = "none";
  };

  // Mostrar/Ocultar Senha
  window.toggleSenha = function () {
    const tipo =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", tipo);
  };

  // Confirmar exclusão
  window.confirmarExclusao = function (id) {
    const confirmar = confirm("Deseja realmente excluir este usuário?");
    if (confirmar) {
      usuarios = usuarios.filter((u) => u.id !== id);
      listarUsuarios();
      alert("Usuário excluído com sucesso!");
    }
  };

  // Salvar usuário (Novo ou Editar)
  usuarioForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = userIdInput.value;
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleInput.value;

    if (!username || !password || !role) {
      alert("Preencha todos os campos!");
      return;
    }

    if (id) {
      // Editar usuário existente
      const user = usuarios.find((u) => u.id == id);
      if (user) {
        user.username = username;
        user.role = role;
      }
      alert("Usuário atualizado com sucesso!");
    } else {
      // Criar novo usuário
      const newUser = {
        id: usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1,
        username,
        role,
        createdAt: new Date().toISOString(),
      };
      usuarios.push(newUser);
      alert("Usuário criado com sucesso!");
    }

    listarUsuarios();
    fecharModal();
  });

  // Botão Logout
  const logoutButton = document.getElementById("logout");
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });

  // Inicializar listagem
  listarUsuarios();
});
