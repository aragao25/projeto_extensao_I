import os
from dotenv import load_dotenv
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

# Carrega variáveis de ambiente
load_dotenv()
PEPPER = os.getenv("PEPPER")

# Prepara o Argon2ID
ph = PasswordHasher()


def gera_senha_segura(senha_digitada):
    # Senha digitada pelo usuário combinada com o Pepper
    senha_com_pepper = senha_digitada + PEPPER

    # Criação do hash final da senha que será gravado no BD
    senha_protegida = ph.hash(senha_com_pepper)

    return senha_protegida


def validar_login(senha_digitada):
    senha_digitada = "OP@cheguei1975"

    # VERIFICAÇÃO DE SENHA DIGITADA PELO USUÁRIO
    hash_salvo_banco = "senhadobanco"
    senha_com_pepper = senha_digitada + PEPPER

    try:
        # Argon2ID compara o hash salvo no banco com a senha digitada pelo usuário
        ph.verify(hash_salvo_banco, senha_com_pepper)
        print("Senha aceita!")
    except VerifyMismatchError:
        print("Senha incorreta!")
