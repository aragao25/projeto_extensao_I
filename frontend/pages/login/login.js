import { supabase, definirLembrar } from "../../services/supabase-client.js";
import { traduzirErroAuth, mostrarMensagem } from "../../services/auth-ui.js";

const PAGINA_DASHBOARD = "../minha_conta/minha_conta.html";

const formulario = document.getElementById("login-formulario");
const mensagem = document.getElementById("login-mensagem");
const botao = formulario.querySelector("button[type='submit']");

// Quem já está logado vai direto ao dashboard
const { data: { session } } = await supabase.auth.getSession();
if (session) window.location.replace(PAGINA_DASHBOARD);

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mostrarMensagem(mensagem, "");

  const email = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value;
  const lembrar = document.getElementById("lembrar").checked;

  botao.disabled = true;                  // evita envio duplo
  try {
    definirLembrar(lembrar);              // precisa vir ANTES do login
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) return mostrarMensagem(mensagem, traduzirErroAuth(error));
    window.location.replace(PAGINA_DASHBOARD);
  } catch (e) {
    mostrarMensagem(mensagem, "Sem conexão com o servidor. Tente novamente.");
  } finally {
    botao.disabled = false;
  }
});