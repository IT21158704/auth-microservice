// lib/jwt-edge.ts
import { jwtVerify } from 'jose';
import { JWTPayload } from '@/types/types';

const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);

export async function verifyAccessTokenEdge(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, secret);

    if ((payload as any).type !== 'access') {
      throw new Error('Invalid token type');
    }

    return payload as unknown as JWTPayload;
  } catch (err) {
    console.error('❌ JWT verify failed:', err);
    throw new Error('Invalid access token');
  }
}
