
/* ============================================================
   ELEMENTOS DO LOGIN
============================================================ */

const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");

const donationInput =
    document.querySelector("#donationInput");


/* ============================================================
   ELEMENTOS DO CHAT
============================================================ */

const chat =
    document.querySelector(".chat");

const chatForm =
    chat.querySelector(".chat__form");

const chatInput =
    chat.querySelector(".chat__input");

const chatMessages =
    chat.querySelector(".chat__messages");


/* ============================================================
   ELEMENTOS DA DOAÇÃO
============================================================ */

const donationTitle =
    document.querySelector("#donationTitle");

const donationInfo =
    document.querySelector("#donationInfo");

const donationStatus =
    document.querySelector("#donationStatus");


/* ============================================================
   BOTÕES
============================================================ */

const negotiateButton =
    document.querySelector("#negotiateButton");

const completeButton =
    document.querySelector("#completeButton");

const reportButton =
    document.querySelector("#reportButton");

const leaveButton =
    document.querySelector("#leaveButton");


/* ============================================================
   CORES DOS USUÁRIOS
============================================================ */

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
];


/* ============================================================
   USUÁRIO ATUAL
============================================================ */

const user = {

    id: "",

    name: "",

    color: "",

    reputation: 5,

    donations: 0,

    received: 0
};


/* ============================================================
   DOAÇÃO ATUAL
============================================================ */

const donation = {

    id: "",

    title: "",

    status: "available"
};


/* ============================================================
   WEBSOCKET
============================================================ */

let websocket;


/* ============================================================
   GERA COR DO USUÁRIO
============================================================ */

const getRandomColor = () => {

    const randomIndex =
        Math.floor(
            Math.random() * colors.length
        );

    return colors[randomIndex];
};


/* ============================================================
   CRIA MENSAGEM DO PRÓPRIO USUÁRIO
============================================================ */

const createMessageSelfElement =
    (content) => {

        const div =
            document.createElement("div");

        div.classList.add(
            "message--self"
        );

        /*
            textContent é utilizado no lugar
            de innerHTML para impedir a execução
            de HTML ou JavaScript enviado pelo usuário.
        */

        div.textContent =
            content;

        return div;
    };


/* ============================================================
   CRIA MENSAGEM DE OUTRO USUÁRIO
============================================================ */

const createMessageOtherElement =
    (
        content,
        sender,
        senderColor
    ) => {

        const div =
            document.createElement("div");

        const span =
            document.createElement("span");


        div.classList.add(
            "message--other"
        );


        span.classList.add(
            "message--sender"
        );


        /*
            A cor vem do servidor.
        */

        span.style.color =
            senderColor;


        /*
            textContent evita HTML malicioso.
        */

        span.textContent =
            sender;


        div.appendChild(
            span
        );


        const messageText =
            document.createTextNode(
                content
            );


        div.appendChild(
            messageText
        );


        return div;
    };


/* ============================================================
   ROLAGEM DO CHAT
============================================================ */

const scrollScreen = () => {

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
};


/* ============================================================
   ATUALIZA STATUS DA DOAÇÃO
============================================================ */

const updateDonationStatus =
    (status) => {

        donation.status =
            status;


        donationStatus.className =
            "status";


        switch (status) {

            case "available":

                donationStatus.textContent =
                    "Disponível";

                donationStatus.classList.add(
                    "status--available"
                );

                break;


            case "negotiating":

                donationStatus.textContent =
                    "Em negociação";

                donationStatus.classList.add(
                    "status--negotiating"
                );

                break;


            case "delivery":

                donationStatus.textContent =
                    "Entrega combinada";

                donationStatus.classList.add(
                    "status--delivery"
                );

                break;


            case "completed":

                donationStatus.textContent =
                    "Doação concluída";

                donationStatus.classList.add(
                    "status--completed"
                );

                break;


            case "cancelled":

                donationStatus.textContent =
                    "Cancelada";

                donationStatus.classList.add(
                    "status--cancelled"
                );

                break;
        }
    };


/* ============================================================
   PROCESSA MENSAGENS DO SERVIDOR
============================================================ */

const processMessage =
    ({ data }) => {

        try {

            const message =
                JSON.parse(data);


            /*
                Ignora mensagens de outra doação.
            */

            if (
                message.donationId &&
                String(message.donationId) !==
                String(donation.id)
            ) {

                return;
            }


            /* -----------------------------------------
               MENSAGEM NORMAL
            ----------------------------------------- */

            if (
                message.type ===
                "message"
            ) {

                const element =
                    message.userId ===
                    user.id

                        ? createMessageSelfElement(
                            message.content
                        )

                        : createMessageOtherElement(
                            message.content,
                            message.userName,
                            message.userColor
                        );


                chatMessages.appendChild(
                    element
                );


                scrollScreen();

                return;
            }


            /* -----------------------------------------
               ALTERAÇÃO DE STATUS
            ----------------------------------------- */

            if (
                message.type ===
                "status"
            ) {

                updateDonationStatus(
                    message.status
                );

                return;
            }


            /* -----------------------------------------
               MENSAGEM DO SISTEMA
            ----------------------------------------- */

            if (
                message.type ===
                "system"
            ) {

                const element =
                    createMessageOtherElement(
                        message.content,
                        "Sistema",
                        "#aaa"
                    );


                chatMessages.appendChild(
                    element
                );


                scrollScreen();

                return;
            }


            /* -----------------------------------------
               RESULTADO DE DENÚNCIA
            ----------------------------------------- */

            if (
                message.type ===
                "reportResult"
            ) {

                alert(
                    message.content
                );

                return;
            }

        } catch (error) {

            console.error(
                "Erro ao processar mensagem:",
                error
            );
        }
    };


/* ============================================================
   VALIDAÇÃO DA MENSAGEM
============================================================ */

const validateMessage =
    (content) => {

        if (!content.trim()) {

            return false;
        }


        if (
            content.length >
            500
        ) {

            alert(
                "A mensagem não pode ter mais de 500 caracteres."
            );

            return false;
        }


        /*
            Filtro básico contra tentativas
            de injeção de código.
        */

        const suspiciousPatterns = [

            "<script",

            "javascript:",

            "onerror=",

            "onload="

        ];


        const lowerContent =
            content.toLowerCase();


        for (
            const pattern
            of suspiciousPatterns
        ) {

            if (
                lowerContent.includes(
                    pattern
                )
            ) {

                alert(
                    "Mensagem bloqueada por segurança."
                );

                return false;
            }
        }


        return true;
    };


/* ============================================================
   LOGIN
============================================================ */

const handleLogin =
    (event) => {

        event.preventDefault();


        /* -----------------------------------------
           VALIDA NOME
        ----------------------------------------- */

        const name =
            loginInput.value.trim();


        if (
            name.length < 2
        ) {

            alert(
                "Informe um nome válido."
            );

            return;
        }


        /* -----------------------------------------
           VALIDA ID DA DOAÇÃO
        ----------------------------------------- */

        const donationId =
            donationInput.value.trim();


        if (!donationId) {

            alert(
                "Informe o ID da doação."
            );

            return;
        }


        /* -----------------------------------------
           IDENTIDADE DO USUÁRIO
        ----------------------------------------- */

        user.id =
            crypto.randomUUID();

        user.name =
            name.substring(
                0,
                50
            );

        user.color =
            getRandomColor();


        /* -----------------------------------------
           IDENTIFICAÇÃO DA DOAÇÃO
        ----------------------------------------- */

        donation.id =
            donationId;

        donation.title =
            `Doação #${donationId}`;


        donationTitle.textContent =
            donation.title;

        donationInfo.textContent =
            `Conversa vinculada à doação #${donationId}`;


        /* -----------------------------------------
           MOSTRA CHAT
        ----------------------------------------- */

        login.style.display =
            "none";

        chat.style.display =
            "flex";


        /* -----------------------------------------
           CONECTA AO SERVIDOR
        ----------------------------------------- */

        websocket =
            new WebSocket(
                "ws://localhost:8080"
            );


        /* -----------------------------------------
           CONEXÃO
        ----------------------------------------- */

        websocket.onopen =
            () => {

                console.log(
                    "Conectado ao servidor."
                );


                /*
                    Solicita entrada na sala
                    da doação.

                    O servidor será responsável
                    pela validação.
                */

                websocket.send(
                    JSON.stringify({

                        type:
                            "join",

                        donationId:
                            donation.id,

                        userId:
                            user.id,

                        userName:
                            user.name,

                        userColor:
                            user.color

                    })
                );
            };


        /* -----------------------------------------
           RECEBIMENTO
        ----------------------------------------- */

        websocket.onmessage =
            processMessage;


        /* -----------------------------------------
           FECHAMENTO
        ----------------------------------------- */

        websocket.onclose =
            () => {

                console.log(
                    "Conexão encerrada."
                );
            };


        /* -----------------------------------------
           ERRO
        ----------------------------------------- */

        websocket.onerror =
            (error) => {

                console.error(
                    "Erro no WebSocket:",
                    error
                );
            };
    };


/* ============================================================
   ENVIA MENSAGEM
============================================================ */

const sendMessage =
    (event) => {

        event.preventDefault();


        if (!websocket) {

            alert(
                "Você ainda não está conectado."
            );

            return;
        }


        if (
            websocket.readyState !==
            WebSocket.OPEN
        ) {

            alert(
                "A conexão ainda não está disponível."
            );

            return;
        }


        const content =
            chatInput.value.trim();


        if (
            !validateMessage(
                content
            )
        ) {

            return;
        }


        /*
            O navegador não envia nome e cor.

            O servidor já possui esses dados.
        */

        const message = {

            type:
                "message",

            donationId:
                donation.id,

            userId:
                user.id,

            content:
                content
        };


        websocket.send(
            JSON.stringify(
                message
            )
        );


        chatInput.value =
            "";

        chatInput.focus();
    };


/* ============================================================
   COMBINAR ENTREGA
============================================================ */

const negotiateDelivery =
    () => {

        if (!websocket) {
            return;
        }


        websocket.send(
            JSON.stringify({

                type:
                    "status",

                donationId:
                    donation.id,

                status:
                    "delivery",

                userId:
                    user.id

            })
        );
    };


/* ============================================================
   CONFIRMAR DOAÇÃO
============================================================ */

const completeDonation =
    () => {

        const confirmation =
            confirm(
                "Você confirma que a doação foi realizada?"
            );


        if (!confirmation) {

            return;
        }


        websocket.send(
            JSON.stringify({

                type:
                    "status",

                donationId:
                    donation.id,

                status:
                    "completed",

                userId:
                    user.id

            })
        );
    };


/* ============================================================
   DENUNCIAR USUÁRIO
============================================================ */

const reportUser =
    () => {

        const reason =
            prompt(
                "Informe o motivo da denúncia:"
            );


        if (
            !reason ||
            !reason.trim()
        ) {

            return;
        }


        websocket.send(
            JSON.stringify({

                type:
                    "report",

                donationId:
                    donation.id,

                userId:
                    user.id,

                reason:
                    reason
                    .trim()
                    .substring(
                        0,
                        500
                    )

            })
        );
    };


/* ============================================================
   SAIR DO CHAT
============================================================ */

const leaveChat =
    () => {

        if (websocket) {

            websocket.close();

            websocket =
                null;
        }


        chat.style.display =
            "none";

        login.style.display =
            "block";


        chatMessages.innerHTML =
            "";


        loginInput.value =
            "";

        donationInput.value =
            "";


        donation.id =
            "";

        donation.title =
            "";

        updateDonationStatus(
            "available"
        );
    };


/* ============================================================
   EVENTOS
============================================================ */

loginForm.addEventListener(
    "submit",
    handleLogin
);


chatForm.addEventListener(
    "submit",
    sendMessage
);


negotiateButton.addEventListener(
    "click",
    negotiateDelivery
);


completeButton.addEventListener(
    "click",
    completeDonation
);


reportButton.addEventListener(
    "click",
    reportUser
);


leaveButton.addEventListener(
    "click",
    leaveChat
);

