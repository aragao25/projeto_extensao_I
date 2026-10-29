from typing import Literal
from pydantic import BaseModel, ConfigDict, Field
from datetime import date
from pydantic import EmailStr


class PessoaUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    nome: str | None = Field(default=None, min_length=2, max_length=120)
    # DDD + número, só dígitos
    telefone: str | None = Field(default=None, pattern=r"^\d{10,11}$")
    data_nascimento: date | None = None


class AnuncioCreate(BaseModel):
    # remove espaços nas pontas
    model_config = ConfigDict(str_strip_whitespace=True)
    titulo: str = Field(min_length=3, max_length=120)
    descricao: str | None = Field(default=None, max_length=2000)
    cidade: str = Field(min_length=2, max_length=80)
    bairro: str | None = Field(default=None, max_length=80)
    categoria: str = Field(min_length=2, max_length=60)
    estado_conservacao: Literal["novo", "bom", "regular"]
    quantidade: int = Field(default=1, ge=1, le=1000)


class AnuncioUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    titulo: str | None = Field(default=None, min_length=3, max_length=120)
    descricao: str | None = None
    cidade: str | None = Field(default=None, min_length=1, max_length=80)
    bairro: str | None = Field(default=None, max_length=80)
    categoria: str | None = Field(default=None, max_length=60)
    estado_conservacao: Literal["novo", "bom", "regular"] | None = None
    quantidade: int | None = Field(default=None, ge=1)
    status: Literal["ativo", "concluido", "cancelado"] | None = None


class InteresseCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    mensagem: str | None = Field(default=None, max_length=500)


class UsuarioCadastro(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    nome: str = Field(min_length=2, max_length=150)
    data_nascimento: date
    # DDD + número, só dígitos
    telefone: str | None = Field(default=None, pattern=r"^\d{10,11}$")
    email: EmailStr
    senha: str = Field(min_length=8, max_length=255)
