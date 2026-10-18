"""seguranca

Revision ID: c6786c7f7ec4
Revises: 83af5a1d1b69
Create Date: 2026-10-18 16:34:40.056063

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c6786c7f7ec4'
down_revision: Union[str, Sequence[str], None] = '83af5a1d1b69'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # liga pessoas ao Supabase Auth
    op.execute("""
        alter table pessoas add constraint pessoas_auth_fkey
        foreign key (id) references auth.users(id) on delete cascade
    """)

    # tudo fechado para a Data API por padrão
    for t in ["pessoas", "itens", "anuncios", "favoritos", "interesses"]:
        op.execute(f"alter table {t} enable row level security")
        op.execute(f"revoke all on {t} from anon, authenticated")

    # leitura pública: só as colunas escolhidas, via view
    op.execute("""
        create view anuncios_publicos as
        select a.id, a.titulo, a.descricao, a.cidade, a.bairro, a.status, a.publicado_em,
               i.categoria, i.estado_conservacao, i.quantidade,
               p.id as doador_id, p.nome as doador_nome
        from anuncios a
        join itens i on i.id = a.item_id
        join pessoas p on p.id = a.doador_id
        where a.status in ('ativo', 'reservado')
    """)
    op.execute("grant select on anuncios_publicos to anon, authenticated")

    # favoritos: cada usuário lê os seus
    op.execute("grant select on favoritos to authenticated")
    op.execute("""
        create policy favoritos_proprios on favoritos
        for select to authenticated using (pessoa_id = auth.uid())
    """)

    # cria a pessoa automaticamente no cadastro
    op.execute("""
        create function public.criar_pessoa() returns trigger
        language plpgsql security definer set search_path = '' as $$
        begin
          insert into public.pessoas (id, nome, email)
          values (new.id,
                  coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
                  new.email);
          return new;
        end; $$
    """)
    op.execute("revoke execute on function public.criar_pessoa() from public, anon, authenticated")
    op.execute("""
        create trigger ao_criar_usuario after insert on auth.users
        for each row execute function public.criar_pessoa()
    """)

def downgrade():
    # remove o trigger e depois a função (o trigger depende dela)
    op.execute("drop trigger if exists ao_criar_usuario on auth.users")
    op.execute("drop function if exists public.criar_pessoa()")

    # favoritos: remove a política e a permissão de leitura
    op.execute("drop policy if exists favoritos_proprios on favoritos")
    op.execute("revoke select on favoritos from authenticated")

    # view pública (os grants dela são removidos junto)
    op.execute("drop view if exists anuncios_publicos")

    # remove a ligação com o Supabase Auth
    op.execute("alter table pessoas drop constraint if exists pessoas_auth_fkey")
