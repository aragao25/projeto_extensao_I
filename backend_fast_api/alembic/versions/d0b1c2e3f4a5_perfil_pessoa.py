"""campos adicionais do perfil da pessoa

Revision ID: d0b1c2e3f4a5
Revises: c6786c7f7ec4
Create Date: 2026-11-20

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "d0b1c2e3f4a5"
down_revision: Union[str, Sequence[str], None] = "c6786c7f7ec4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("pessoas", sa.Column("cidade", sa.String(length=80), nullable=True))
    op.add_column("pessoas", sa.Column("bairro", sa.String(length=80), nullable=True))
    op.add_column("pessoas", sa.Column("sobre", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("pessoas", "sobre")
    op.drop_column("pessoas", "bairro")
    op.drop_column("pessoas", "cidade")
