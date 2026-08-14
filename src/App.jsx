import { useEffect, useState } from 'react';
import Login from './pages/login';
import CreateAccount from './pages/CreateAccount';
import AddQMTDevice from './pages/AddQMTDevice';
import PrivatePrivacy from './Components/PrivatePolicy/privateprivacy';
import english from './en.json';
import { assertPhoneAuthEnabled, requireSupabase } from './lib/supabase';

const getPageFromHash = () => {
  const page = window.location.hash.slice(1);
  return ['login', 'register', 'device', 'privacy'].includes(page) ? page : 'login';
};

export default function App() {
  const [page, setPage] = useState(getPageFromHash);
  const [translations, setTranslations] = useState(english);
  const [languageCode, setLanguageCode] = useState('en');

  const register = async ({ fullName, countryCode, mobileNumber, farmName, password }) => {
    await assertPhoneAuthEnabled();
    const client = requireSupabase();
    const { data, error } = await client.auth.signUp({
      phone: `${countryCode}${mobileNumber}`,
      password,
      options: { data: { full_name: fullName.trim(), country_code: countryCode, mobile_number: mobileNumber, farm_name: farmName.trim(), preferred_language: languageCode } },
    });
    if (error) {
      if (/phone.*(disabled|not enabled)|unsupported.*phone/i.test(error.message)) {
        throw new Error('Phone sign-up is disabled in Supabase. Enable the Phone provider and configure Twilio in Authentication → Sign In / Providers.');
      }
      if (/database error saving new user/i.test(error.message)) {
        throw new Error('Supabase Auth created the request, but the profile database trigger failed. Run the latest supabase-schema.sql in the SQL Editor.');
      }
      throw error;
    }
    if (data.session) navigate('device');
    return data;
  };

  const login = async ({ loginId, password }) => {
    const client = requireSupabase();
    const identifier = loginId.trim();
    const credentials = identifier.includes('@')
      ? { email: identifier, password }
      : { phone: identifier.startsWith('+') ? identifier : `+91${identifier}`, password };
    const { error } = await client.auth.signInWithPassword(credentials);
    if (error) throw error;
    navigate('device');
  };

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
  if (page === 'privacy') return <PrivatePrivacy onBack={() => navigate('login')} />;
  if (page === 'register') {
    return <CreateAccount messages={translations.register} onLogin={() => navigate('login')} onRegister={register} />;
  }
  const changeLanguage = (nextTranslations, nextCode) => {
    setTranslations(nextTranslations);
    setLanguageCode(nextCode);
  };

  return <Login languageCode={languageCode} onTranslationsChange={changeLanguage} onCreateAccount={() => navigate('register')} onPrivacy={() => navigate('privacy')} onLogin={login} />;
}
