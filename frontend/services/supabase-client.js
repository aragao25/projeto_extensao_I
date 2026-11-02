import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://tigjlylttwtwzdmzxowl.supabase.co";          // a mesma SUPABASE_URL do .env
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpZ2pseWx0dHd0d3pkbXp4b3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzMzQwMjQsImV4cCI6MjEwNzkxMDAyNH0.D1TEU4DjSykA1ZVxMnDTcFwReLBwTLsIxgoTAujNG6s";   // só a chave pública
const CHAVE_LEMBRAR = "doacoes-lembrar-sessao";

const armazenamento = {
  getItem: (chave) => localStorage.getItem(chave) ?? sessionStorage.getItem(chave),
  setItem: (chave, valor) => {
    const lembrar = localStorage.getItem(CHAVE_LEMBRAR) !== "0";
    (lembrar ? localStorage : sessionStorage).setItem(chave, valor);
    (lembrar ? sessionStorage : localStorage).removeItem(chave);
  },
  removeItem: (chave) => {
    localStorage.removeItem(chave);
    sessionStorage.removeItem(chave);
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { storage: armazenamento },
});

export function definirLembrar(lembrar) {
  localStorage.setItem(CHAVE_LEMBRAR, lembrar ? "1" : "0");
}