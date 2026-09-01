lucide.createIcons();

function abrirLocalizacao(endereco) {
  const urlCodificada = encodeURIComponent(endereco);
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${urlCodificada}`,
    "_blank",
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const btnCategorias = document.getElementById("btnCategorias");
  const submenuCategorias = document.getElementById("submenuCategorias");
  const seta = btnCategorias.querySelector(".seta");

  btnCategorias.addEventListener("click", () => {
    // Alterna a exibição do submenu
    submenuCategorias.classList.toggle("ativo");

    // Rotaciona a seta indicadora
    seta.classList.toggle("rotacionada");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const btnMinhaconta = document.getElementById("btnMinhaconta");
  const submenuMinhaconta = document.getElementById("submenuMinhaconta");
  const setaminhaconta = btnMinhaconta.querySelector(".setaminhaconta");

  btnMinhaconta.addEventListener("click", () => {
    // Alterna a exibição do submenu
    submenuMinhaconta.classList.toggle("ativo");

    // Rotaciona a seta indicadora
    setaminhaconta.classList.toggle("rotacionada");
  });
});

const tabs = document.querySelectorAll(".tab");
const conteudo = document.getElementById("conteudo");

const paginas = {
    doados:
    `
        <h2>Doados</h2>
        <p>Você ainda não deu nenhum item.</p>
    `,

    adquiridos:
    `
        <h2>Adquiridos</h2>
        <p>Você ainda não adquiriu nenhum item.</p>
    `,

    favoritos:  
    `
        <h2>Favoritos</h2>
        <p>Você ainda não adicionou nenhum item aos favoritos.</p>
    `,

    seguranca: `
        <h2>Segurança e privacidade</h2>
        <p>Aqui ficam as informações sobre segurança e privacidade.</p>
    `,

    termo: `
        <h2>Termo de responsabilidade</h2>
        <p>Aqui ficam os termos de responsabilidade.</p>
    `
};

tabs.forEach(tab => {
    tab.addEventListener("click", () => {

        // Remove o destaque de todas
        tabs.forEach(t => t.classList.remove("active"));

        // Destaca a clicada
        tab.classList.add("active");

        // Descobre qual aba foi clicada
        const nome = tab.dataset.tab;

        // Troca somente o conteúdo
        conteudo.innerHTML = paginas[nome];
    });
});

