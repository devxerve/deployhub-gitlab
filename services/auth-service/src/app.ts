import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
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

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
