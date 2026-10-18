import uuid
from datetime import date, datetime
from sqlalchemy import CheckConstraint, DateTime, ForeignKey, String, Text, UniqueConstraint, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class Pessoa(Base):
    __tablename__ = "pessoas"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True)   # = auth.users.id
    nome: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True)
    telefone: Mapped[str | None] = mapped_column(String(20))
    data_nascimento: Mapped[date | None]
    criado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class Item(Base):
    __tablename__ = "itens"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    doador_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("pessoas.id", ondelete="CASCADE"), index=True)
    recebedor_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("pessoas.id", ondelete="SET NULL"))
    categoria: Mapped[str] = mapped_column(String(60), index=True)
    estado_conservacao: Mapped[str] = mapped_column(String(20))
    quantidade: Mapped[int] = mapped_column(default=1)
    disponivel: Mapped[bool] = mapped_column(default=True)
    __table_args__ = (CheckConstraint("quantidade > 0", name="ck_item_quantidade"),)

class Anuncio(Base):
    __tablename__ = "anuncios"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    doador_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("pessoas.id", ondelete="CASCADE"), index=True)
    item_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("itens.id", ondelete="CASCADE"), unique=True)
    titulo: Mapped[str] = mapped_column(String(120))
    descricao: Mapped[str | None] = mapped_column(Text)
    cidade: Mapped[str] = mapped_column(String(80), index=True)
    bairro: Mapped[str | None] = mapped_column(String(80))
    status: Mapped[str] = mapped_column(String(20), default="ativo")
    publicado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (
        CheckConstraint("status in ('ativo','reservado','concluido','cancelado')", name="ck_anuncio_status"),
    )

class Favorito(Base):
    __tablename__ = "favoritos"
    pessoa_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("pessoas.id", ondelete="CASCADE"), primary_key=True)
    anuncio_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("anuncios.id", ondelete="CASCADE"), primary_key=True)
    criado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class Interesse(Base):
    __tablename__ = "interesses"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    anuncio_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("anuncios.id", ondelete="CASCADE"), index=True)
    solicitante_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("pessoas.id", ondelete="CASCADE"))
    mensagem: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), default="pendente")
    criado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (
        UniqueConstraint("anuncio_id", "solicitante_id"),
        CheckConstraint("status in ('pendente','aceito','recusado')", name="ck_interesse_status"),
    )