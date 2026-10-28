
const $ = (seletor) => document.querySelector(seletor);

const dados = {
  usuarios: [
    { nome: "Maria Silva", email: "maria@exemplo.com", cadastro: "12/10/2026", status: "Ativo" },
    { nome: "João Santos", email: "joao@exemplo.com", cadastro: "15/10/2026", status: "Ativo" },
    { nome: "Ana Costa", email: "ana@exemplo.com", cadastro: "18/10/2026", status: "Ativo" },
    { nome: "Pedro Lima", email: "pedro@exemplo.com", cadastro: "20/10/2026", status: "Ativo" }
  ],

  anuncios: [
    { id: 1, nome: "Roupas para doação", categoria: "Roupas", responsavel: "Maria Silva", status: "Ativo" },
    { id: 2, nome: "Livros escolares", categoria: "Livros", responsavel: "João Santos", status: "Pendente" },
    { id: 3, nome: "Mesa de madeira", categoria: "Móveis", responsavel: "Ana Costa", status: "Ativo" },
    { id: 4, nome: "Brinquedos infantis", categoria: "Brinquedos", responsavel: "Pedro Lima", status: "Concluído" },
    { id: 5, nome: "Cesta de alimentos", categoria: "Alimentos", responsavel: "Maria Silva", status: "Pendente" }
  ],

  solicitacoes: [
    { nome: "Pedido de roupas", solicitante: "João Santos", data: "22/10/2026", status: "Pendente" },
    { nome: "Pedido de livros", solicitante: "Ana Costa", data: "23/10/2026", status: "Ativo" },
    { nome: "Pedido de móveis", solicitante: "Pedro Lima", data: "24/10/2026", status: "Concluído" }
  ],

  categorias: [
    "Roupas",
    "Livros",
    "Móveis",
    "Alimentos",
    "Eletrônicos",
    "Brinquedos",
    "Higiene e limpeza",
    "Esportes"
  ]
};

const titulos = {
  "visao-geral": "Visão geral",
  usuarios: "Usuários",
  anuncios: "Anúncios",
  solicitacoes: "Solicitações",
  categorias: "Categorias",
  moderacao: "Moderação"
};

function escapar(valor) {
  return String(valor).replace(/[&<>"']/g, (caractere) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[caractere]);
}

function classeStatus(status) {
  const classes = {
    "Ativo": "ativo",
    "Pendente": "pendente",
    "Concluído": "concluido"
  };

  return classes[status] || "";
}

function etiquetaStatus(status) {
  return `<span class="status ${classeStatus(status)}">${escapar(status)}</span>`;
}

// Navegação entre as áreas do painel.
function abrirView(nome) {
  if (!titulos[nome]) return;

  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("ativa", view.id === `view-${nome}`);
  });

  document.querySelectorAll(".nav-item").forEach((botao) => {
    botao.classList.toggle("ativo", botao.dataset.view === nome);
  });

  $("#titulo-pagina").textContent = titulos[nome];

  $("#sidebar").classList.remove("aberto");
  $("#fundo-menu").classList.remove("visivel");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-view]").forEach((botao) => {
  botao.addEventListener("click", () => abrirView(botao.dataset.view));
});

document.querySelectorAll("[data-go]").forEach((botao) => {
  botao.addEventListener("click", () => abrirView(botao.dataset.go));
});

// Menu para telas pequenas.
$("#abrir-menu").addEventListener("click", () => {
  $("#sidebar").classList.add("aberto");
  $("#fundo-menu").classList.add("visivel");
});

$("#fechar-menu").addEventListener("click", fecharMenu);
$("#fundo-menu").addEventListener("click", fecharMenu);

function fecharMenu() {
  $("#sidebar").classList.remove("aberto");
  $("#fundo-menu").classList.remove("visivel");
}

// Data atual.
$("#data-atual").textContent = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric"
}).format(new Date());

// Tabela de anúncios recentes.
function renderizarRecentes() {
  $("#tabela-recentes").innerHTML = dados.anuncios.slice(0, 4).map((item) => `
    <tr>
      <td>${escapar(item.nome)}</td>
      <td>${escapar(item.categoria)}</td>
      <td>${escapar(item.responsavel)}</td>
      <td>${etiquetaStatus(item.status)}</td>
    </tr>
  `).join("");
}

// Usuários.
function renderizarUsuarios() {
  const termo = $("#busca-usuarios").value.trim().toLowerCase();

  const encontrados = dados.usuarios.filter((usuario) =>
    `${usuario.nome} ${usuario.email}`.toLowerCase().includes(termo)
  );

  $("#tabela-usuarios").innerHTML = encontrados.map((usuario) => `
    <tr>
      <td>${escapar(usuario.nome)}</td>
      <td>${escapar(usuario.email)}</td>
      <td>${escapar(usuario.cadastro)}</td>
      <td>${etiquetaStatus(usuario.status)}</td>
    </tr>
  `).join("");

  $("#vazio-usuarios").hidden = encontrados.length > 0;
}

// Anúncios e pesquisa.
function renderizarAnuncios() {
  const termo = $("#busca-anuncios").value.trim().toLowerCase();
  const status = $("#filtro-anuncios").value;

  const encontrados = dados.anuncios.filter((item) => {
    const correspondeTexto =
      `${item.nome} ${item.categoria} ${item.responsavel}`
        .toLowerCase().includes(termo);

    return correspondeTexto && (!status || item.status === status);
  });

  $("#tabela-anuncios").innerHTML = encontrados.map((item) => `
    <tr>
      <td>${escapar(item.nome)}</td>
      <td>${escapar(item.categoria)}</td>
      <td>${escapar(item.responsavel)}</td>
      <td>${etiquetaStatus(item.status)}</td>
      <td>
        ${item.status === "Pendente"
          ? `<button class="botao-acao" data-aprovar="${item.id}">Aprovar</button>`
          : "—"}
      </td>
    </tr>
  `).join("");

  $("#vazio-anuncios").hidden = encontrados.length > 0;
}

// Solicitações.
function renderizarSolicitacoes() {
  $("#tabela-solicitacoes").innerHTML = dados.solicitacoes.map((item) => `
    <tr>
      <td>${escapar(item.nome)}</td>
      <td>${escapar(item.solicitante)}</td>
      <td>${escapar(item.data)}</td>
      <td>${etiquetaStatus(item.status)}</td>
    </tr>
  `).join("");
}

// Moderação.
function renderizarModeracao() {
  const pendentes = dados.anuncios.filter(
    (item) => item.status === "Pendente"
  );

  $("#tabela-moderacao").innerHTML = pendentes.map((item) => `
    <tr>
      <td>${escapar(item.nome)}</td>
      <td>${escapar(item.categoria)}</td>
      <td>${escapar(item.responsavel)}</td>
      <td>
        <button class="botao-acao" data-aprovar="${item.id}">
          Aprovar anúncio
        </button>
      </td>
    </tr>
  `).join("");

  $("#vazio-moderacao").hidden = pendentes.length > 0;
}

// Aprovação de demonstração.
document.addEventListener("click", (evento) => {
  const botao = evento.target.closest("[data-aprovar]");
  if (!botao) return;

  const id = Number(botao.dataset.aprovar);
  const anuncio = dados.anuncios.find((item) => item.id === id);

  if (!anuncio || anuncio.status !== "Pendente") return;

  const confirmar = window.confirm(
    `Deseja aprovar o anúncio "${anuncio.nome}"?`
  );

  if (!confirmar) return;

  anuncio.status = "Ativo";

  renderizarTudo();
});

// Categorias.
function renderizarCategorias() {
  $("#lista-categorias").innerHTML = dados.categorias.map((categoria, indice) => `
    <div class="categoria-item">
      <span>${escapar(categoria)}</span>
      <button class="botao-acao"
              data-remover-categoria="${indice}"
              aria-label="Remover categoria ${escapar(categoria)}">
        Remover
      </button>
    </div>
  `).join("");
}

$("#form-categoria").addEventListener("submit", (evento) => {
  evento.preventDefault();

  const campo = $("#nova-categoria");
  const nome = campo.value.trim();

  if (!nome) return;

  const duplicada = dados.categorias.some(
    (categoria) => categoria.toLowerCase() === nome.toLowerCase()
  );

  if (duplicada) {
    $("#mensagem-categoria").textContent =
      "Essa categoria já existe.";
    return;
  }

  dados.categorias.push(nome);
  renderizarCategorias();

  campo.value = "";
  $("#mensagem-categoria").textContent =
    "Categoria adicionada nesta demonstração.";
});

$("#lista-categorias").addEventListener("click", (evento) => {
  const botao = evento.target.closest("[data-remover-categoria]");
  if (!botao) return;

  const indice = Number(botao.dataset.removerCategoria);
  const nome = dados.categorias[indice];

  if (!nome) return;

  if (window.confirm(`Remover a categoria "${nome}" desta demonstração?`)) {
    dados.categorias.splice(indice, 1);
    renderizarCategorias();
    $("#mensagem-categoria").textContent =
      "Categoria removida desta demonstração.";
  }
});

// Filtros.
$("#busca-usuarios").addEventListener("input", renderizarUsuarios);
$("#busca-anuncios").addEventListener("input", renderizarAnuncios);
$("#filtro-anuncios").addEventListener("change", renderizarAnuncios);

// Atualiza indicadores a partir dos dados demonstrativos.
function atualizarIndicadores() {
  $("#total-usuarios").textContent = dados.usuarios.length;
  $("#total-anuncios").textContent = dados.anuncios.length;
  $("#total-solicitacoes").textContent = dados.solicitacoes.length;

  $("#total-pendentes").textContent = dados.anuncios.filter(
    (item) => item.status === "Pendente"
  ).length;
}

function renderizarTudo() {
  renderizarRecentes();
  renderizarUsuarios();
  renderizarAnuncios();
  renderizarSolicitacoes();
  renderizarModeracao();
  renderizarCategorias();
  atualizarIndicadores();
}

renderizarTudo();
