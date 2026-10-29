
const categorias = [
  {
    nome: "Roupas e calçados",
    descricao: "Roupas, sapatos e acessórios em bom estado.",
    icone: "👕"
  },
  {
    nome: "Livros e materiais",
    descricao: "Livros, cadernos e materiais escolares.",
    icone: "📚"
  },
  {
    nome: "Móveis e utensílios",
    descricao: "Móveis, objetos para casa e utensílios.",
    icone: "🪑"
  },
  {
    nome: "Alimentos",
    descricao: "Alimentos não perecíveis para quem precisa.",
    icone: "🥫"
  },
  {
    nome: "Eletrônicos",
    descricao: "Computadores, celulares e outros aparelhos.",
    icone: "💻"
  },
  {
    nome: "Brinquedos",
    descricao: "Brinquedos, jogos e itens infantis.",
    icone: "🧸"
  },
  {
    nome: "Higiene e limpeza",
    descricao: "Produtos de higiene pessoal e limpeza.",
    icone: "🧼"
  },
  {
    nome: "Esportes",
    descricao: "Bolas, bicicletas e artigos esportivos.",
    icone: "⚽"
  },
  {
    nome: "Outros",
    descricao: "Outros itens que podem ajudar alguém.",
    icone: "💚"
  }
];

const lista = document.getElementById("lista-categorias");
const pesquisa = document.getElementById("pesquisa");
const contador = document.getElementById("contador");
const mensagemVazia = document.getElementById("mensagem-vazia");
const mensagemStatus = document.getElementById("mensagem-status");

function renderizarCategorias(termo = "") {
  const termoNormalizado = termo
    .trim()
    .toLocaleLowerCase("pt-BR");

  const filtradas = categorias.filter((categoria) =>
    `${categoria.nome} ${categoria.descricao}`
      .toLocaleLowerCase("pt-BR")
      .includes(termoNormalizado)
  );

  lista.innerHTML = "";

  filtradas.forEach((categoria) => {
    const cartao = document.createElement("article");
    cartao.className = "cartao-categoria";

    const icone = document.createElement("div");
    icone.className = "icone-categoria";
    icone.setAttribute("aria-hidden", "true");
    icone.textContent = categoria.icone;

    const titulo = document.createElement("h3");
    titulo.textContent = categoria.nome;

    const descricao = document.createElement("p");
    descricao.textContent = categoria.descricao;

    const botao = document.createElement("button");
    botao.className = "botao-categoria";
    botao.type = "button";
    botao.textContent = "Ver anúncios →";

    botao.addEventListener("click", () => {
      mensagemStatus.textContent =
        `Categoria selecionada: ${categoria.nome}. ` +
        "A listagem de anúncios será integrada nesta etapa.";

      // Futuramente, podemos abrir anúncios.html
      // passando o nome da categoria pela URL.
    });

    cartao.append(icone, titulo, descricao, botao);
    lista.appendChild(cartao);
  });

  contador.textContent =
    `${filtradas.length} ${
      filtradas.length === 1 ? "categoria" : "categorias"
    }`;

  mensagemVazia.hidden = filtradas.length > 0;
}

pesquisa.addEventListener("input", () => {
  mensagemStatus.textContent = "";
  renderizarCategorias(pesquisa.value);
});

renderizarCategorias();
