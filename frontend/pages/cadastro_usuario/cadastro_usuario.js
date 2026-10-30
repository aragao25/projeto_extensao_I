const formulario = document.getElementById('cadastro-form');
const modal = document.getElementById('modal-alerta');
const textoAlerta = document.getElementById('texto-alerta');
const botaoFecharModal = document.getElementById('botao-fechar-modal');

function exibirMensagem (texto) {
    textoAlerta.textContent = texto;
    modal.classList.remove('oculto');
}

botaoFecharModal.onclick = () => {
    modal.classList.add('oculto');
}

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
            exibirMensagem("Cadastro realizado com sucesso!");
            formulario.reset();

            botaoFecharModal.onclick = () => {
                window.location.href = '../login/login.html';
            };
        } else {
            const dadosErro = await resposta.json()
            exibirMensagem(`Atenção: ${dadosErro.detail}`)

            botaoFecharModal.onclick = () => {
                modal.classList.add('oculto');
            };
        }

    } catch (erro) {
        exibirMensagem("Erro de conexão. Tente novamente mais tarde.")
        console.error(`Erro crítico: ${erro}`)

        botaoFecharModal.onclick = () => {
                modal.classList.add('oculto');
        };
    }
});