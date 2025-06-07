import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    console.log('🔐 Password hashed successfully');
    return hashedPassword;
  } catch (error) {
    console.error('❌ Password hashing failed:', error);
    throw new Error('Failed to hash password');
  }
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('🔍 Password comparison completed:', isValid ? 'MATCH' : 'NO MATCH');
    return isValid;
  } catch (error) {
    console.error('❌ Password comparison failed:', error);
    throw new Error('Failed to compare password');
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) {
    return null;
  }

  // Expected format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}