const campoSenha = document.getElementById('nova-senha');

campoSenha.addEventListener('input', function() {
    const senhaDigitada = campoSenha.value;

    if (senhaDigitada.length >= 8) {
        document.getElementById('caracteres').classList.add('regra-valida');
    } else {
        document.getElementById('caracteres').classList.remove('regra-valida');
    }

    document.getElementById('numero').classList.toggle('regra-valida', /[0-9]/.test(senhaDigitada))

    if (/[A-Z]/.test(senhaDigitada)) {
        document.getElementById('maiuscula').classList.add('regra-valida');
    } else {
        document.getElementById('maiuscula').classList.remove('regra-valida');
    }
    
    if (/[a-z]/.test(senhaDigitada)) {
        document.getElementById('minuscula').classList.add('regra-valida');
    } else {
        document.getElementById('minuscula').classList.remove('regra-valida');
    }

    // if (/[0-9]/.test(senhaDigitada)) {
    //     document.getElementById('numero').classList.add('regra-valida');
    // } else {
    //     document.getElementById('numero').classList.remove('regra-valida');
    // }

    if (/[@#$%&*!]/.test(senhaDigitada)) {
        document.getElementById('especial').classList.add('regra-valida');
    } else {
        document.getElementById('especial').classList.remove('regra-valida');
    }
});