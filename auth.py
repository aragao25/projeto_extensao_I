import os
from dotenv import load_dotenv
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi import FastAPI

# Inicia o servidor web
app = FastAPI()

# Carrega variáveis de ambiente
load_dotenv()
PEPPER = os.getenv("PEPPER")

# Prepara o Argon2ID
ph = PasswordHasher()


# Cria rota escutando o método POST no caminho \login
@app.post("/login")
def validar_login():
    senha_digitada = "OP@cheguei1975"

    # Senha digitada pelo usuário combinada com o Pepper
    senha_com_pepper = senha_digitada + PEPPER

    # Criação do hash final da senha que será gravado no BD
    hash_final = ph.hash(senha_com_pepper)

    print(hash_final)

    # VERIFICAÇÃO DE SENHA DIGITADA PELO USUÁRIO
    hash_salvo_banco = "senhadobanco"
    senha_digitada_pelo_usuario = "SenhaUsuario111!"
    senha_com_pepper = senha_digitada_pelo_usuario + PEPPER

    try:
        # Argon2ID compara o hash salvo no banco com a senha digitada pelo usuário
        ph.verify(hash_salvo_banco, senha_com_pepper)
        print("Senha aceita!")
    except VerifyMismatchError:
        print("Senha incorreta!")
