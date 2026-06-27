import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { seedDatabase } from './db/seed';
import './index.css';

// Initialize database with seed data on first launch
const seedPromise = seedDatabase().catch((err) => {
  console.error('Seed failed:', err);
  return err as Error;
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App seedPromise={seedPromise} />
    </BrowserRouter>
  </StrictMode>
);