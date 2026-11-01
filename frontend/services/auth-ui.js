const ERROS = {
  invalid_credentials: "E-mail ou senha incorretos.",
  email_not_confirmed: "Confirme o e-mail antes de entrar.",
  weak_password: "A senha é fraca demais. Use uma mais longa.",
  user_already_exists: "Este e-mail já está cadastrado.",
  email_exists: "Este e-mail já está cadastrado.",
  email_address_invalid: "E-mail inválido.",
  over_email_send_rate_limit: "Muitas tentativas. Aguarde alguns minutos.",
  over_request_rate_limit: "Muitas tentativas. Aguarde alguns minutos.",
};

export function traduzirErroAuth(error) {
  console.error(error.code, error.message);      // ajuda a descobrir códigos novos
  return ERROS[error.code] ?? "Não foi possível concluir a operação. Tente novamente.";
}

export function mostrarMensagem(elemento, texto, tipo = "erro") {
  elemento.textContent = texto;
  elemento.classList.remove("tela-login__mensagem--erro", "tela-login__mensagem--sucesso");
  if (texto) elemento.classList.add(`tela-login__mensagem--${tipo}`);
}