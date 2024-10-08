import * as bcrypt from 'bcryptjs';

/**
 * Hashes a password with a salt.
 * @param password The password to hash
 * @param saltRounds The number of salt rounds to use (default: 10)
 * @returns A promise that resolves to the hashed password
 */
export async function saltAndHashPassword(password: any, saltRounds = 10): Promise<{ salt: string, hash: string }> {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(saltRounds);
    
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    
    return { salt, hash: hashedPassword };
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
}

/**
 * Compares a password with a hashed password.
 * @param password The password to check
 * @param hashedPassword The hashed password to compare against
 * @returns A promise that resolves to true if the password matches, false otherwise
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw new Error('Failed to compare passwords');
  }
}