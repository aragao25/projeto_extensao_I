import uuid
import jwt
from jwt import PyJWKClient
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import settings

bearer = HTTPBearer()
jwks = PyJWKClient(f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json")

def usuario_atual(cred: HTTPAuthorizationCredentials = Depends(bearer)) -> uuid.UUID:
    token = cred.credentials
    try:
        chave = jwks.get_signing_key_from_jwt(token).key
        payload = jwt.decode(token, chave, algorithms=["ES256", "RS256"], audience="authenticated")
    except jwt.PyJWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token inválido")
    return uuid.UUID(payload["sub"])