
const checkboxAceite = document.getElementById("checkboxAceite");
const botaoAceitar = document.getElementById("aceitar");

// Verifica se o usuário aceitou o termo
checkboxAceite.addEventListener("change", function () {

    // Habilita o botão somente quando o termo for aceito
    botaoAceitar.disabled = !this.checked;

});


// Ação do botão "Aceitar e continuar"
botaoAceitar.addEventListener("click", function () {

    if (checkboxAceite.checked) {

        // Redireciona o usuário para a página inicial
        window.location.href = "index.html";

    }

});

