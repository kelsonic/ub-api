// Node modules.
import path from 'path';
import dotenv from 'dotenv';

// IIFE to load the env file.
(() => {
  // Set the env file.
  const result = dotenv.config({
    path: path.join(__dirname, `../../.env`),
  });

  // Handle errors.
  if (result.error) {
    console.warn(
      'Error copying .env file. If a .env file is not expected, then this is okay.',
      result.error,
    );
  }
})();
