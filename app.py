import os
from flask import Flask, request, jsonify
from itsdangerous import URLSafeTimedSerializer
from dotenv import load_dotenv
from seguranca import gera_senha_segura

# Configuração inicial da aplicação
app = Flask(__name__)
load_dotenv()
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")


@app.route('/api/recuperar-senha', methods=['POST'])
def recuperar_senha():
    dados = request.get_json()
    email = dados.get('email')

    if email:
        # 1. Instanciamos o gerador usando a nossa chave secreta
        gerador_token = URLSafeTimedSerializer(app.config['SECRET_KEY'])

        # 2. Geramos o token embutindo o e-mail
        token = gerador_token.dumps(email, salt='recuperacao-senha')

        # 3. Montamos o link final (que será enviado por e-mail)
        link = f"http://meusite.com/nova-senha?token={token}"

        print(f"Simulando envio de e-mail para {email} com o link: {link}")
        return jsonify({"mensagem": "Se o e-mail existir, um link de recuperação será enviado."}), 200

    return jsonify({"erro": "E-mail não fornecido."}), 400


@app.route('/api/atualizar-senha', methods=['POST'])
def atualizar_senha():
    dados = request.get_json()
    token = dados.get('token')
    nova_senha = dados.get('senha')

    if not token or not nova_senha:
        return jsonify({"erro": "Token e nova senha são obrigatórios."}), 400

    try:
        # 1. Valida o token e extrai o e-mail (limite de 15 minutos = 900 segundos)
        gerador_token = URLSafeTimedSerializer(app.config['SECRET_KEY'])
        email_do_token = gerador_token.loads(
            token, salt='recuperacao-senha', max_age=900)

        # 2. Gera o hash seguro usando a nossa função isolada
        senha_final_hash = gera_senha_segura(nova_senha)

        # 3. TODO: Salvar no banco de dados
        # Aqui entrará a sua lógica de atualização...

        return jsonify({"mensagem": "Senha atualizada com sucesso!"}), 200

    except Exception as e:
        # O bloco except captura os erros se o tempo passar de 15 min ou o token for inválido
        return jsonify({"erro": "Link inválido ou expirado."}), 400
