import secrets

meu_secreto = secrets.token_hex(16)
meu_token = secrets.token_hex(32)

print(meu_secreto)
print(meu_token)
