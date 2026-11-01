import { supabase } from "supabase-client.js";

const API_URL = "http://localhost:8000";    // em produção, o endereço do FastAPI hospedado

export async function chamarApi(caminho, opcoes = {}) {
  // getSession devolve a sessão atual e renova o token se ele já expirou
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Faça login primeiro.");

  const resp = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      ...opcoes.headers,
    },
  });

  if (!resp.ok) {
    const corpo = await resp.json().catch(() => ({}));
    throw new Error(`${resp.status}: ${JSON.stringify(corpo.detail ?? corpo)}`);
  }
  return resp.status === 204 ? null : resp.json();
}