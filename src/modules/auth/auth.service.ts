import bcrypt from 'bcrypt';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/error.middleware';
import { generateToken } from '../../utils/jwt';


export const registerUser = async (name: string, email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AppError('User already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
    },
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });
  

  return token;
};