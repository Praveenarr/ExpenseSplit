import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from './store';
import { HomePage } from './pages/HomePage';
import { TripPage } from './pages/TripPage';

function App() {
  const { activeTrip, darkMode } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontFamily: 'DM Sans, sans-serif',
          },
          duration: 2500,
        }}
      />
      {activeTrip ? <TripPage /> : <HomePage />}
    </>
  );
}

export default App;
