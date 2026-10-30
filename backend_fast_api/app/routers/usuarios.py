from fastapi import APIRouter
from app.schemas import UsuarioCadastro
from app.core.db import supabase
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/usuarios", tags=["usuarios"])


@router.post("/cadastro")
async def criar_usuario(dados_usuario: UsuarioCadastro):
    try:
        resposta = supabase.auth.sign_up(
            {"email": dados_usuario.email,
             "password": dados_usuario.senha}
        )
        usuario_id = resposta.user.id

        supabase.table("pessoas").update({
            "nome": dados_usuario.nome,
            "email": dados_usuario.email,
            "telefone": dados_usuario.telefone,
            "data_nascimento": str(dados_usuario.data_nascimento)
        }).eq("id", usuario_id).execute()

        return {
            "mensagem": "Usuário cadastrado com sucesso!",
            "id": usuario_id,
            "nome": dados_usuario.nome,
            "email": dados_usuario.email
        }
    except Exception as erro:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")
