import { supabase } from "../../services/supabase-client.js";

if (window.lucide) {
  window.lucide.createIcons();
}

async function configurarSessaoNaHome() {
  const { data: { session } } = await supabase.auth.getSession();
  const logado = Boolean(session);

  document.querySelectorAll(".apenas-logado").forEach((elemento) => {
    elemento.hidden = !logado;
  });

  const entrar = document.getElementById("entrar-home");
  if (entrar) entrar.hidden = logado;

}

configurarSessaoNaHome();
supabase.auth.onAuthStateChange(() => configurarSessaoNaHome());

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
  if (!btnCategorias || !submenuCategorias) return;
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
  if (!btnMinhaconta || !submenuMinhaconta) return;
  const setaminhaconta = btnMinhaconta.querySelector(".setaminhaconta");

  btnMinhaconta.addEventListener("click", () => {
    // Alterna a exibição do submenu
    submenuMinhaconta.classList.toggle("ativo");

    // Rotaciona a seta indicadora
    setaminhaconta.classList.toggle("rotacionada");
  });
});
