
/* ============================================================
   SERVIDOR WEBSOCKET
   DOAR PRO BEM
============================================================ */


/* ============================================================
   IMPORTAÇÕES
============================================================ */

const {
    WebSocketServer
} = require("ws");

const dotenv =
    require("dotenv");


/* ============================================================
   CONFIGURAÇÃO DO DOTENV
============================================================ */

dotenv.config();


/*
    A porta será definida pelo arquivo .env.

    Caso não exista PORT no .env,
    será utilizada a porta 8080.
*/

const PORT =
    process.env.PORT || 8080;


/* ============================================================
   CRIAÇÃO DO SERVIDOR
============================================================ */

const wss =
    new WebSocketServer({
        port: PORT
    });


/* ============================================================
   SALAS DAS DOAÇÕES
============================================================ */

/*
    Cada doação possui uma sala própria.

    Exemplo:

    Doação #1
        João
        Maria

    Doação #2
        Pedro
        Ana

    João e Maria não recebem mensagens
    da conversa de Pedro e Ana.
*/

const rooms =
    new Map();


/* ============================================================
   USUÁRIOS
============================================================ */

/*
    Os usuários ficam armazenados em memória
    neste protótipo.

    Em produção:
    utilizar banco de dados.
*/

const users =
    new Map();


/* ============================================================
   DOAÇÕES
============================================================ */

const donations =
    new Map();


/*
    Cada doação poderá possuir:

    id
    title
    status
    messages
    reports
*/


/* ============================================================
   OBTÉM OU CRIA UMA SALA
============================================================ */

const getRoom =
    (donationId) => {

        const id =
            String(donationId);


        if (!rooms.has(id)) {

            rooms.set(
                id,
                new Set()
            );
        }


        return rooms.get(id);
    };


/* ============================================================
   OBTÉM OU CRIA UMA DOAÇÃO
============================================================ */

const getDonation =
    (donationId) => {

        const id =
            String(donationId);


        /*
            Neste protótipo a doação é criada
            automaticamente.

            No sistema definitivo, a doação
            deverá existir no banco de dados.
        */

        if (
            !donations.has(id)
        ) {

            donations.set(
                id,
                {

                    id: id,

                    title:
                        `Doação #${id}`,

                    status:
                        "available",

                    messages:
                        [],

                    reports:
                        []
                }
            );
        }


        return donations.get(id);
    };


/* ============================================================
   ENVIA MENSAGEM PARA TODA A SALA
============================================================ */

const broadcastToRoom =
    (
        donationId,
        message
    ) => {

        const room =
            rooms.get(
                String(donationId)
            );


        if (!room) {
            return;
        }


        const data =
            JSON.stringify(
                message
            );


        room.forEach(
            (client) => {

                if (
                    client.readyState ===
                    client.OPEN
                ) {

                    client.send(
                        data
                    );
                }
            }
        );
    };


/* ============================================================
   ENVIA MENSAGEM PARA UM CLIENTE
============================================================ */

const sendToClient =
    (
        ws,
        message
    ) => {

        if (
            ws.readyState ===
            ws.OPEN
        ) {

            ws.send(
                JSON.stringify(
                    message
                )
            );
        }
    };


/* ============================================================
   ENTRAR NA SALA DA DOAÇÃO
============================================================ */

const joinRoom =
    (
        ws,
        data
    ) => {

        const donationId =
            String(
                data.donationId
            );


        const userId =
            String(
                data.userId
            );


        /*
            Verifica os dados mínimos.
        */

        if (
            !donationId ||
            !userId
        ) {

            sendToClient(
                ws,
                {

                    type:
                        "system",

                    content:
                        "Não foi possível entrar na conversa."

                }
            );

            return;
        }


        /* -----------------------------------------
           CADASTRA USUÁRIO
        ----------------------------------------- */

        if (
            !users.has(userId)
        ) {

            users.set(
                userId,
                {

                    id:
                        userId,

                    /*
                        O nome é armazenado no servidor.

                        O cliente não poderá alterá-lo
                        simplesmente enviando outro nome
                        em cada mensagem.
                    */

                    name:
                        String(
                            data.userName || "Usuário"
                        )
                        .trim()
                        .substring(
                            0,
                            50
                        ),

                    color:
                        String(
                            data.userColor ||
                            "cadetblue"
                        ),

                    /*
                        Reputação inicial.
                    */

                    reputation:
                        5,

                    donations:
                        0,

                    received:
                        0,

                    reports:
                        0
                }
            );
        }


        const user =
            users.get(
                userId
            );


        /* -----------------------------------------
           OBTÉM A DOAÇÃO
        ----------------------------------------- */

        const donation =
            getDonation(
                donationId
            );


        /* -----------------------------------------
           VINCULA O SOCKET
        ----------------------------------------- */

        ws.userId =
            user.id;

        ws.donationId =
            donation.id;


        /* -----------------------------------------
           ADICIONA À SALA
        ----------------------------------------- */

        const room =
            getRoom(
                donation.id
            );


        room.add(
            ws
        );


        /* -----------------------------------------
           ENVIA STATUS
        ----------------------------------------- */

        sendToClient(
            ws,
            {

                type:
                    "status",

                donationId:
                    donation.id,

                status:
                    donation.status

            }
        );


        /* -----------------------------------------
           ENVIA HISTÓRICO
        ----------------------------------------- */

        donation.messages.forEach(
            (message) => {

                sendToClient(
                    ws,
                    message
                );
            }
        );


        /* -----------------------------------------
           AVISA QUE USUÁRIO ENTROU
        ----------------------------------------- */

        broadcastToRoom(
            donation.id,
            {

                type:
                    "system",

                donationId:
                    donation.id,

                content:
                    `${user.name} entrou na conversa.`

            }
        );


        console.log(
            `Usuário ${user.name} entrou na doação ${donation.id}.`
        );
    };


/* ============================================================
   PROCESSA MENSAGEM
============================================================ */

const processMessage =
    (
        ws,
        data
    ) => {

        /*
            O usuário precisa estar
            em uma sala.
        */

        if (
            !ws.donationId ||
            !ws.userId
        ) {

            return;
        }


        const user =
            users.get(
                ws.userId
            );


        if (!user) {
            return;
        }


        const donation =
            getDonation(
                ws.donationId
            );


        /* -----------------------------------------
           TEXTO
        ----------------------------------------- */

        const content =
            String(
                data.content || ""
            )
            .trim()
            .substring(
                0,
                500
            );


        if (!content) {
            return;
        }


        /* -----------------------------------------
           FILTRO BÁSICO
        ----------------------------------------- */

        const forbiddenPatterns = [

            "<script",

            "javascript:",

            "onerror=",

            "onload="

        ];


        const lowerContent =
            content.toLowerCase();


        const suspicious =
            forbiddenPatterns.some(
                (pattern) =>
                    lowerContent.includes(
                        pattern
                    )
            );


        if (suspicious) {

            sendToClient(
                ws,
                {

                    type:
                        "system",

                    donationId:
                        donation.id,

                    content:
                        "Mensagem bloqueada por segurança."

                }
            );

            return;
        }


        /* -----------------------------------------
           CRIA A MENSAGEM
        ----------------------------------------- */

        const message = {

            type:
                "message",

            donationId:
                donation.id,

            /*
                O servidor determina a identidade
                do remetente.
            */

            userId:
                user.id,

            userName:
                user.name,

            userColor:
                user.color,

            content:
                content,

            timestamp:
                new Date().toISOString()
        };


        /* -----------------------------------------
           SALVA HISTÓRICO
        ----------------------------------------- */

        donation.messages.push(
            message
        );


        /*
            Mantém no máximo 200 mensagens
            em memória.
        */

        if (
            donation.messages.length >
            200
        ) {

            donation.messages.shift();
        }


        /* -----------------------------------------
           MUDA STATUS
        ----------------------------------------- */

        if (
            donation.status ===
            "available"
        ) {

            donation.status =
                "negotiating";
        }


        /* -----------------------------------------
           ENVIA PARA A SALA
        ----------------------------------------- */

        broadcastToRoom(
            donation.id,
            message
        );
    };


/* ============================================================
   ALTERA STATUS DA DOAÇÃO
============================================================ */

const updateStatus =
    (
        ws,
        data
    ) => {

        if (
            !ws.donationId ||
            !ws.userId
        ) {

            return;
        }


        const donation =
            getDonation(
                ws.donationId
            );


        const newStatus =
            String(
                data.status
            );


        /*
            Estados permitidos.
        */

        const allowedStatuses = [

            "negotiating",

            "delivery",

            "completed"

        ];


        if (
            !allowedStatuses.includes(
                newStatus
            )
        ) {

            return;
        }


        /*
            Não permite modificar uma
            doação já concluída.
        */

        if (
            donation.status ===
            "completed"
        ) {

            return;
        }


        donation.status =
            newStatus;


        /* -----------------------------------------
           AVISA A SALA
        ----------------------------------------- */

        broadcastToRoom(
            donation.id,
            {

                type:
                    "status",

                donationId:
                    donation.id,

                status:
                    donation.status

            }
        );


        /* -----------------------------------------
           MENSAGEM DO SISTEMA
        ----------------------------------------- */

        let systemMessage =
            "";


        if (
            newStatus ===
            "delivery"
        ) {

            systemMessage =
                "A entrega foi marcada como combinada.";
        }


        if (
            newStatus ===
            "completed"
        ) {

            systemMessage =
                "A doação foi marcada como concluída.";
        }


        if (
            systemMessage
        ) {

            broadcastToRoom(
                donation.id,
                {

                    type:
                        "system",

                    donationId:
                        donation.id,

                    content:
                        systemMessage

                }
            );
        }
    };


/* ============================================================
   REGISTRA DENÚNCIA
============================================================ */

const reportUser =
    (
        ws,
        data
    ) => {

        if (
            !ws.donationId ||
            !ws.userId
        ) {

            return;
        }


        const reporter =
            users.get(
                ws.userId
            );


        const donation =
            getDonation(
                ws.donationId
            );


        if (!reporter) {
            return;
        }


        const reason =
            String(
                data.reason || ""
            )
            .trim()
            .substring(
                0,
                500
            );


        if (!reason) {
            return;
        }


        /*
            Registra a denúncia.

            Em produção, salvar no banco.
        */

        const report = {

            reporterId:
                reporter.id,

            donationId:
                donation.id,

            reason:
                reason,

            timestamp:
                new Date().toISOString()

        };


        donation.reports.push(
            report
        );


        reporter.reports++;


        /*
            IMPORTANTE:

            Não reduzimos automaticamente
            a reputação do denunciado.

            A denúncia deverá ser analisada.
        */

        sendToClient(
            ws,
            {

                type:
                    "reportResult",

                content:
                    "Denúncia registrada. A equipe poderá analisar a conversa."

            }
        );


        console.log(
            `Denúncia registrada na doação ${donation.id}.`
        );
    };


/* ============================================================
   NOVA CONEXÃO
============================================================ */

wss.on(
    "connection",
    (ws) => {

        console.log(
            "Usuário conectado!"
        );


        /* -----------------------------------------
           ERRO
        ----------------------------------------- */

        ws.on(
            "error",
            console.error
        );


        /* -----------------------------------------
           RECEBIMENTO DE MENSAGENS
        ----------------------------------------- */

        ws.on(
            "message",
            (rawData) => {

                try {

                    const data =
                        JSON.parse(
                            rawData.toString()
                        );


                    switch (
                        data.type
                    ) {

                        case "join":

                            joinRoom(
                                ws,
                                data
                            );

                            break;


                        case "message":

                            processMessage(
                                ws,
                                data
                            );

                            break;


                        case "status":

                            updateStatus(
                                ws,
                                data
                            );

                            break;


                        case "report":

                            reportUser(
                                ws,
                                data
                            );

                            break;


                        default:

                            console.log(
                                "Tipo desconhecido:",
                                data.type
                            );
                    }

                } catch (error) {

                    console.error(
                        "Erro ao processar mensagem:",
                        error
                    );
                }
            }
        );


        /* -----------------------------------------
           USUÁRIO DESCONECTOU
        ----------------------------------------- */

        ws.on(
            "close",
            () => {

                if (
                    ws.donationId &&
                    rooms.has(
                        ws.donationId
                    )
                ) {

                    const room =
                        rooms.get(
                            ws.donationId
                        );


                    room.delete(
                        ws
                    );


                    /*
                        Se não houver mais ninguém
                        na sala, ela é removida.
                    */

                    if (
                        room.size === 0
                    ) {

                        rooms.delete(
                            ws.donationId
                        );
                    }
                }


                console.log(
                    "Usuário desconectado!"
                );
            }
        );
    }
);


/* ============================================================
   SERVIDOR INICIADO
============================================================ */

console.log(`Servidor WebSocket rodando na porta ${PORT}`);