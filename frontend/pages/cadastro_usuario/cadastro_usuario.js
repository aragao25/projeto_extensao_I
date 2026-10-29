const formulario = document.getElementById('cadastro-form');

formulario.addEventListener('submit', async function(evento) {
    evento.preventDefault();

    try {
        const dadosUsuario = {
            nome: document.getElementById('nome-completo').value,
            telefone: document.getElementById('telefone').value,
            data_nascimento: document.getElementById('data-nascimento').value,
            email: document.getElementById('email').value,
            senha: document.getElementById('nova-senha').value
        }

        const resposta = await fetch('http://127.0.0.1:8000/usuarios/cadastro', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(dadosUsuario)
        });

        if (resposta.ok) {
            console.log("Cadastro realizado com sucesso!");
            formulario.reset();
        } else {
            console.log("E-mail já existe.")
        }

    } catch (erro) {
        console.error(`Erro crítico: ${erro}`)
    }
});