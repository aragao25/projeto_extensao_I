const formulario = document.getElementById('cadastro-form');

formulario.addEventListener('submit', async function(evento) {
    evento.preventDefault();

    try {
        const dadosUsuario = {
            nome: document.getElementById('nome-completo').value,
            telefone: document.getElementById('telefone').value,
            dataNascimento: document.getElementById('data-nascimento').value,
            email: document.getElementById('email').value,
            senha: document.getElementById('senha').value
        }

        const resposta = await fetch('url-do-seu-backend/cadastro', {
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