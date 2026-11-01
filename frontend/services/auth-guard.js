import { supabase } from "./supabase-client.js";

const PAGINA_LOGIN = "pages/login/login.html";    // a página onde está o seu formulário de login

export async function exigirLogin() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.replace(PAGINA_LOGIN);
    return null;
  }
  return session;
}

export async function sair() {
  // scope "local": encerra só este navegador. O padrão ("global") derruba todos os dispositivos
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) console.error("Erro ao sair:", error.message);
  window.location.replace(PAGINA_LOGIN);       // sai mesmo que a chamada falhe
}

supabase.auth.onAuthStateChange((evento) => {
  if (evento === "SIGNED_OUT") window.location.replace(PAGINA_LOGIN);
});