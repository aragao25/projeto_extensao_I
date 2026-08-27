lucide.createIcons();

function abrirLocalizacao(endereco) {
  const urlCodificada = encodeURIComponent(endereco);
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${urlCodificada}`,
    "_blank",
  );
}

function abrirMapaGeral() {
  window.open(
    "https://www.google.com/maps/search/?api=1&query=Restinga,+Porto+Alegre+-+RS",
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
