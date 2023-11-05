// Load the env file.
import dotenv from 'dotenv';
dotenv.config();
// Node modules.
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
// Relative modules.
import logger from '@utils/logger';
import version1Router from '@routes/v1';

const app = express();

// Middleware.
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan('combined'));
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute.
  max: 10, // Limit each IP to 10 requests per windowMs.
});
app.use(limiter);

// Routes.
app.use('/v1', version1Router);
app.get('/health', (req, res) => res.status(200).send('OK'));

// Start the server.
const startServer = (port: number = Number(process.env.PORT) || 3000) => {
  app
    .listen(port, () => {
      // ASCII Art for "Urantia Book API"
      const asciiArt = `
      U   U  RRRR    A   N   N  TTTTT  I   A
      U   U  R   R  A A  NN  N    T    I  A A
      U   U  RRRR  AAAAA NN  N    T    I AAAAA
      U   U  R  R  A   A N N N    T    I A   A
       UUU   R   R A   A N  NN    T    I A   A
      `;

      // Display ASCII Art
      logger.info(asciiArt);
      // Basic server info
      logger.info(`🚀 Server started on port ${port}`);
      logger.info(`⚙️  NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
      // Useful URLs
      logger.info(`📚 API Documentation: http://localhost:${port}/docs`);
      logger.info(`🩺 Health: http://localhost:${port}/health`);
      logger.info(`📘 Urantia Book: http://localhost:${port}/urantia-book`);
      // Any other useful info
      logger.info(`🔒 Rate limit set to 10 requests per minute`);
    })
    .on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        logger.warn(`Port ${port} is in use, trying port ${port + 1}`);
        startServer(port + 1);
      } else {
        logger.error('Failed to start server:', error);
      }
    });
};

startServer();
