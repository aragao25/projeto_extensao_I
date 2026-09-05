const campoSenha = document.getElementById('nova-senha');
const campoConfirma = document.getElementById('confirma-senha');
const regraCaracteres = document.getElementById('caracteres');
const regraMaiuscula = document.getElementById('maiuscula');
const regraMinuscula = document.getElementById('minuscula');
const regraNumero = document.getElementById('numero');
const regraEspecial = document.getElementById('especial');
const botaoVisualiza = document.querySelectorAll('.botao-visualiza');
const iconeOlhoAberto = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
const iconeOlhoFechado = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;
const botaoSalvar = document.getElementById('botao-salvar');

function validarSenhas() {
    const senha = campoSenha.value;
    const confirma = campoConfirma.value;

    // Regras individuais
    const temOitoCaracteres = senha.length >= 8;
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const temEspecial = /[!@#$%&*]/.test(senha);

    // Destaque visual das regras 📋
    regraCaracteres.classList.toggle('regra-valida', temOitoCaracteres);
    regraMaiuscula.classList.toggle('regra-valida', temMaiuscula);
    regraMinuscula.classList.toggle('regra-valida', temMinuscula);
    regraNumero.classList.toggle('regra-valida', temNumero);
    regraEspecial.classList.toggle('regra-valida', temEspecial);

    const eValida = temOitoCaracteres && temMaiuscula && temMinuscula && temNumero && temEspecial;
    const senhasCoincidem = (senha === confirma) && confirma !== '';

    // Destaque visual dos campos 🟢
    campoSenha.classList.toggle('campo-valido', eValida);
    campoConfirma.classList.toggle('campo-valido', eValida && senhasCoincidem);

    // Habilita ou desabilita o botão 🔓/🔒
    botaoSalvar.disabled = !(eValida && senhasCoincidem);
}

// Escuta a digitação nos dois campos ⌨️
campoSenha.addEventListener('input', validarSenhas);
campoConfirma.addEventListener('input', validarSenhas);

// Lógica de mostrar/esconder senha 👁️
botaoVisualiza.forEach(function(botao) {
    botao.addEventListener('click', function() {
        const input = botao.parentElement.querySelector('input');
        if (input.type === 'password') {
            input.type = 'text';
            botao.innerHTML = iconeOlhoFechado;
            botao.setAttribute('aria-label', 'Esconder senha');
        } else {
            input.type = 'password';
            botao.innerHTML = iconeOlhoAberto;
            botao.setAttribute('aria-label', 'Mostrar senha');
        }
    });
});