from flask import Flask, request, jsonify
from flask_cors import CORS  # Permite requisições vindas do navegador

app = Flask(__name__)
CORS(app)  # Libera o acesso para o seu frontend


@app.route('/api/recuperar-senha', methods=['POST'])
def recuperar_senha():
    # 1. Pega os dados enviados em formato JSON pelo JS
    dados = request.get_json()
    email = dados.get('email')

    # 2. Simulação de verificação
    if email:
        return jsonify({"mensagem": "E-mail enviado com sucesso!"}), 200
    else:
        return jsonify({"mensagem": "Erro: informe um e-mail válido."}), 400


if __name__ == '__main__':
    app.run(port=5000, debug=True)
