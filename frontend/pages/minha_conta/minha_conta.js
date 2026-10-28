
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

// Recupera dados previamente salvos neste navegador.
try {
  const dadosSalvos = localStorage.getItem("doaTingaPerfil");

  if (dadosSalvos) {
    preencherFormulario(JSON.parse(dadosSalvos));
  } else {
    atualizarResumo({});
  }
} catch (erro) {
  atualizarResumo({});
}

formPerfil.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const dados = obterDadosFormulario();

  try {
    localStorage.setItem("doaTingaPerfil", JSON.stringify(dados));

    atualizarResumo(dados);
    mensagemPerfil.textContent = "Dados salvos neste navegador.";
  } catch (erro) {
    mensagemPerfil.textContent =
      "Não foi possível salvar os dados neste navegador.";
  }
});

formPerfil.addEventListener("reset", () => {
  mensagemPerfil.textContent = "";

  setTimeout(() => {
    atualizarResumo(obterDadosFormulario());
  }, 0);
});

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

document.getElementById("botao-sair").addEventListener("click", () => {
  const confirmar = window.confirm("Deseja sair da sua conta?");

  if (confirmar) {
    window.alert(
      "A saída da conta ainda precisa ser integrada ao sistema de autenticação."
    );
  }
});
