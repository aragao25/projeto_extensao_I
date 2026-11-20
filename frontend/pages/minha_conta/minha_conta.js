import { supabase } from "../../services/supabase-client.js";
import { exigirLogin } from "../../services/auth-guard.js";
import { chamarApi } from "../../services/api.js";

const formPerfil = document.getElementById("form-perfil");
const mensagemPerfil = document.getElementById("mensagem-perfil");

const campos = [
  "nome",
  "email",
  "telefone",
  "cidade",
  "bairro",
  "sobre"
];

const nomeResumo = document.getElementById("nome-resumo");
const emailResumo = document.getElementById("email-resumo");
const avatar = document.getElementById("avatar");

function atualizarResumo(dados) {
  const nome = dados.nome?.trim() || "Usuário";
  const email = dados.email?.trim() || "E-mail não informado";

  nomeResumo.textContent = nome;
  emailResumo.textContent = email;
  avatar.textContent = nome.charAt(0).toLocaleUpperCase("pt-BR");
}

function obterDadosFormulario() {
  const dados = {};

  campos.forEach((id) => {
    dados[id] = document.getElementById(id).value.trim();
  });

  return dados;
}

function preencherFormulario(dados) {
  campos.forEach((id) => {
    document.getElementById(id).value = dados[id] || "";
  });

  atualizarResumo(dados);
}

async function carregarPerfil() {
  try {
    const perfil = await chamarApi("/me");
    const dadosSalvos = JSON.parse(
      localStorage.getItem("doaTingaPerfil") || "{}"
    );

    preencherFormulario({
      nome: perfil.nome,
      email: perfil.email,
      telefone: perfil.telefone,
      cidade: perfil.cidade,
      bairro: perfil.bairro,
      sobre: perfil.sobre
    });
  } catch (erro) {
    try {
      const dadosSalvos = JSON.parse(
        localStorage.getItem("doaTingaPerfil") || "{}"
      );
      preencherFormulario(dadosSalvos);
    } catch {
      atualizarResumo({});
    }
  }
}

formPerfil.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const dados = obterDadosFormulario();
  const botaoSalvar = formPerfil.querySelector('button[type="submit"]');
  botaoSalvar.disabled = true;
  mensagemPerfil.textContent = "";

  try {
    localStorage.setItem("doaTingaPerfil", JSON.stringify(dados));

    await chamarApi("/me", {
      method: "PATCH",
      body: JSON.stringify({
        nome: dados.nome,
        telefone: dados.telefone || null,
        cidade: dados.cidade || null,
        bairro: dados.bairro || null,
        sobre: dados.sobre || null
      })
    });

    if (dados.email) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email !== dados.email) {
        const { error } = await supabase.auth.updateUser({
          email: dados.email
        });
        if (error) throw error;
      }
    }

    atualizarResumo(dados);
    mensagemPerfil.textContent =
      "Dados pessoais atualizados com sucesso.";
  } catch (erro) {
    mensagemPerfil.textContent = `Não foi possível salvar: ${erro.message}`;
  } finally {
    botaoSalvar.disabled = false;
  }
});

formPerfil.addEventListener("reset", () => {
  mensagemPerfil.textContent = "";

  setTimeout(() => {
    atualizarResumo(obterDadosFormulario());
  }, 0);
});

function criarItemConta(titulo, descricao, metadados) {
  const item = document.createElement("article");
  item.className = "item-conta";

  const conteudo = document.createElement("div");
  const tituloElemento = document.createElement("h3");
  tituloElemento.textContent = titulo;
  conteudo.appendChild(tituloElemento);

  if (descricao) {
    const descricaoElemento = document.createElement("p");
    descricaoElemento.textContent = descricao;
    conteudo.appendChild(descricaoElemento);
  }

  const tags = document.createElement("div");
  tags.className = "item-conta-meta";

  metadados.forEach((texto) => {
    const tag = document.createElement("span");
    tag.className = "tag-status";
    tag.textContent = texto;
    tags.appendChild(tag);
  });

  conteudo.appendChild(tags);
  item.appendChild(conteudo);
  return item;
}

function exibirEstadoVazio(container, icone, titulo, texto) {
  container.replaceChildren();

  const estado = document.createElement("div");
  estado.className = "estado-vazio";

  const iconeElemento = document.createElement("span");
  iconeElemento.className = "icone-vazio";
  iconeElemento.textContent = icone;

  const tituloElemento = document.createElement("h3");
  tituloElemento.textContent = titulo;

  const textoElemento = document.createElement("p");
  textoElemento.textContent = texto;

  estado.append(iconeElemento, tituloElemento, textoElemento);
  container.appendChild(estado);
}

async function carregarMeusAnuncios() {
  const container = document.getElementById("lista-meus-anuncios");

  try {
    const anuncios = await chamarApi("/anuncios/meus");
    if (!anuncios.length) {
      exibirEstadoVazio(
        container,
        "📭",
        "Nenhum anúncio para exibir",
        "Quando você publicar uma doação, ela aparecerá aqui."
      );
      return;
    }

    container.replaceChildren();
    anuncios.forEach((anuncio) => {
      container.appendChild(
        criarItemConta(
          anuncio.titulo,
          `${anuncio.categoria} • ${anuncio.quantidade} unidade(s)`,
          [anuncio.status, anuncio.cidade]
        )
      );
    });
  } catch (erro) {
    exibirEstadoVazio(
      container,
      "⚠️",
      "Não foi possível carregar seus anúncios",
      erro.message
    );
  }
}

async function carregarMinhasSolicitacoes() {
  const container = document.getElementById("lista-minhas-solicitacoes");

  try {
    const solicitacoes = await chamarApi("/interesses/enviados");
    if (!solicitacoes.length) {
      exibirEstadoVazio(
        container,
        "📋",
        "Nenhuma solicitação para exibir",
        "Suas solicitações aparecerão aqui quando forem registradas."
      );
      return;
    }

    container.replaceChildren();
    solicitacoes.forEach((solicitacao) => {
      container.appendChild(
        criarItemConta(
          solicitacao.anuncio_titulo,
          solicitacao.mensagem || "Solicitação sem mensagem.",
          [solicitacao.status]
        )
      );
    });
  } catch (erro) {
    exibirEstadoVazio(
      container,
      "⚠️",
      "Não foi possível carregar suas solicitações",
      erro.message
    );
  }
}

// Menu lateral: destaca a seção selecionada.
const linksMenu = document.querySelectorAll(".item-menu");

linksMenu.forEach((link) => {
  link.addEventListener("click", () => {
    linksMenu.forEach((item) => item.classList.remove("ativo"));
    link.classList.add("ativo");
  });
});

// Destaca a seção correspondente quando a página é rolada.
const secoes = document.querySelectorAll(
  "#perfil, #meus-anuncios, #solicitacoes, #seguranca"
);

if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver(
    (entradas) => {
      const visiveis = entradas
        .filter((entrada) => entrada.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visiveis.length > 0) {
        const idSecao = visiveis[0].target.id;

        linksMenu.forEach((link) => {
          link.classList.toggle(
            "ativo",
            link.getAttribute("href") === `#${idSecao}`
          );
        });
      }
    },
    {
      rootMargin: "-10% 0px -60% 0px",
      threshold: [0, 0.25, 0.5]
    }
  );

  secoes.forEach((secao) => observador.observe(secao));
}

// Ações que ainda dependem da autenticação do projeto.
document.getElementById("botao-senha").addEventListener("click", () => {
  document.getElementById("mensagem-seguranca").textContent =
    "A alteração de senha precisa ser conectada ao sistema de autenticação.";
});

document.getElementById("botao-sair").addEventListener("click", async () => {
  const confirmar = window.confirm("Deseja sair da sua conta?");

  if (confirmar) {
    try {
      // 1. Executa o logout no Supabase (remove o token do local/session storage)
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      // 2. Limpa os dados do perfil salvos localmente (opcional, dependendo da sua regra de negócio)
      localStorage.removeItem("doaTingaPerfil");

      // 3. Redireciona o usuário para a página de login ou home
      window.alert("Você saiu da sua conta com sucesso!");
      window.location.href = "../login/login.html"; // Altere para a sua página de destino
      
    } catch (erro) {
      console.error("Erro ao sair:", erro.message);
      window.alert("Não foi possível encerrar a sessão: " + erro.message);
    }
  }
});

async function inicializarConta() {
  const sessao = await exigirLogin();
  if (!sessao) return;

  await Promise.all([
    carregarPerfil(),
    carregarMeusAnuncios(),
    carregarMinhasSolicitacoes()
  ]);
}

inicializarConta();
