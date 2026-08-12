import { useEffect, useState } from 'react';
import Login from './pages/login';
import CreateAccount from './pages/CreateAccount';
import AddQMTDevice from './pages/AddQMTDevice';
import english from './en.json';

const getPageFromHash = () => {
  const page = window.location.hash.slice(1);
  return ['login', 'register', 'device'].includes(page) ? page : 'login';
};

export default function App() {
  const [page, setPage] = useState(getPageFromHash);
  const [translations, setTranslations] = useState(english);
  const [languageCode, setLanguageCode] = useState('en');

  useEffect(() => {
    const handleHashChange = () => setPage(getPageFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (nextPage) => {
    window.location.hash = nextPage;
    setPage(nextPage);
  };

  if (page === 'device') return <AddQMTDevice messages={translations.deviceSetup} />;
  if (page === 'register') {
    return <CreateAccount messages={translations.register} onLogin={() => navigate('login')} onRegister={() => navigate('device')} />;
  }
  const changeLanguage = (nextTranslations, nextCode) => {
    setTranslations(nextTranslations);
    setLanguageCode(nextCode);
  };

  return <Login languageCode={languageCode} onTranslationsChange={changeLanguage} onCreateAccount={() => navigate('register')} />;
}
