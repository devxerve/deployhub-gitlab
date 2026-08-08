import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import oauthRoutes from './routes/oauth.routes';

const app = express();


app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use('/auth', authRoutes);
app.use('/auth/oauth', oauthRoutes);
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'auth-service' });
});

const PORT = process.env.PORT_AUTH_SERVICE;

// Ensures a fresh database (a new machine, a wiped volume, ...) always has a
// working admin account, instead of requiring someone to create one by hand.
async function seedAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !username || !password) {
    return;
  }

  const prisma = new PrismaClient();

  try {
    const existing = await prisma.users.findUnique({ where: { email } });

    if (existing) {
      if (existing.role !== 'admin') {
        await prisma.users.update({
          where: { user_id: existing.user_id },
          data: { role: 'admin' },
        });
      }
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);

    await prisma.users.create({
      data: { username, email, password_hash, role: 'admin' },
    });

    console.log(`Seeded admin account: ${email}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function bootstrap(): Promise<void> {
  await seedAdmin();
  app.listen(PORT);
}

void bootstrap();
