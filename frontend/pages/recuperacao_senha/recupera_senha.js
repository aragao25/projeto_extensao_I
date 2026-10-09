const campoEmail = document.getElementById('email-usuario');
const botaoRecuperar = document.getElementById('botao-recuperar');
const formulario = document.getElementById('recupera-senha-form');
const respostaTela = document.getElementById('mensagem-resposta');

campoEmail.addEventListener('input', function() {
    botaoRecuperar.disabled = (campoEmail.value == "" || !campoEmail.checkValidity());
});

formulario.addEventListener('submit', async function(evento) {
    evento.preventDefault();

    try {
        const resposta = await fetch('http://localhost:5000/api/recuperar-senha', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({email: campoEmail.value})
        });
        const dados = await resposta.json();

        let iconeSvg = "";

        if (resposta.ok) {
            iconeSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#3B82F6" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>`;
        } else {
            iconeSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#EF4444" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>`;
        }
        
        respostaTela.innerHTML =  `${iconeSvg} <span>${dados.mensagem}</span>`;

    } catch (erro) {
        const iconeErro = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#EF4444" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>`;
        respostaTela.innerHTML = `${iconeErro} <span>Erro ao conectar com o servidor. Tente novamente mais tarde.</span>`;
    } finally {
        botaoRecuperar.disabled = false;
    }
});

