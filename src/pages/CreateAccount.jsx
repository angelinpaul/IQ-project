import { useState } from 'react';
import { ArrowLeft, UserRound, LockKeyhole, Eye, EyeOff, ShieldCheck, ChartNoAxesCombined, Headphones } from 'lucide-react';
import '../styles/CreateAccount.css';
import farmIllustration from '../assets/farm-landscape.png';

export default function CreateAccount({ messages, onLogin, onRegister }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [farmName, setFarmName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const setError = (field, message) => setErrors((current) => ({ ...current, [field]: message }));

  const validatePassword = (value) => {
    if (!value) return messages.validation.passwordRequired;
    if (value.length < 8 || !/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/\d/.test(value) || !/[^A-Za-z0-9]/.test(value)) {
      return messages.validation.passwordRequirements;
    }
    return '';
  };

  const validateMobile = (value, code = countryCode) => {
    if (!value) return messages.validation.mobileRequired;
    if (code === '+91' && value.length !== 10) return messages.validation.indianMobileLength;
    if (code !== '+91' && (value.length < 6 || value.length > 15)) return messages.validation.invalidMobile;
    return '';
  };

  const handleFullName = (event) => {
    const typedValue = event.target.value;
    const cleanValue = typedValue.replace(/[^A-Za-z ]/g, '');
    setFullName(cleanValue);
    setError('fullName', typedValue === cleanValue ? '' : messages.validation.lettersAndSpacesOnly);
  };

  const handleMobile = (event) => {
    const maxLength = countryCode === '+91' ? 10 : 15;
    const cleanValue = event.target.value.replace(/\D/g, '').slice(0, maxLength);
    setMobileNumber(cleanValue);
    setError('mobileNumber', validateMobile(cleanValue));
  };

  const handlePassword = (event) => {
    const value = event.target.value;
    setPassword(value);
    setError('password', validatePassword(value));
    if (confirmPassword) setError('confirmPassword', confirmPassword === value ? '' : messages.validation.passwordsDoNotMatch);
  };

  const handleConfirmPassword = (event) => {
    const value = event.target.value;
    setConfirmPassword(value);
    setError('confirmPassword', value === password ? '' : messages.validation.passwordsDoNotMatch);
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {
      fullName: fullName.trim() ? '' : messages.validation.fullNameRequired,
      mobileNumber: validateMobile(mobileNumber),
      password: validatePassword(password),
      confirmPassword: confirmPassword && confirmPassword === password ? '' : messages.validation.passwordsDoNotMatch,
    };
    setErrors(nextErrors);
    if (!Object.values(nextErrors).some(Boolean)) {
      setSubmitting(true);
      setSubmitError('');
      try {
        const data = await onRegister({ fullName, countryCode, mobileNumber, farmName, password });
        if (!data.session) setSubmitError('Account created. Verify the OTP sent to your phone, then log in.');
      } catch (error) {
        setSubmitError(error.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return <main className="register-page"><section className="register-card">
    <div className="register-form-side">
      <a className="back-link" href="#login" onClick={onLogin}><ArrowLeft size={15} /> {messages.backToLogin}</a>
      <div className="register-heading"><h1>{messages.title}</h1><p>{messages.subtitle}</p></div>
      <form className="register-form" onSubmit={submit} noValidate>
        <label>{messages.fullNameLabel}<span className="input-shell"><UserRound size={15} /><input type="text" placeholder={messages.fullNamePlaceholder} value={fullName} onChange={handleFullName} onBlur={() => setError('fullName', fullName.trim() ? '' : messages.validation.fullNameRequired)} aria-invalid={Boolean(errors.fullName)} /></span>{errors.fullName && <small role="alert">{errors.fullName}</small>}</label>
        <label>{messages.mobileNumberLabel}<span className="phone-row"><select className="country-code" value={countryCode} aria-label={messages.countryCodeLabel} onChange={(event) => { setCountryCode(event.target.value); setMobileNumber(''); setError('mobileNumber', ''); }}>
          {Object.entries(messages.countries).map(([code, label]) => <option key={code} value={code}>{label}</option>)}
        </select><input type="tel" inputMode="numeric" placeholder={messages.mobileNumberPlaceholder} value={mobileNumber} maxLength={countryCode === '+91' ? 10 : 15} onChange={handleMobile} onBlur={() => setError('mobileNumber', validateMobile(mobileNumber))} aria-invalid={Boolean(errors.mobileNumber)} /></span>{errors.mobileNumber && <small role="alert">{errors.mobileNumber}</small>}</label>
        <label>{messages.farmNameLabel}<span className="input-shell"><UserRound size={15} /><input type="text" placeholder={messages.farmNamePlaceholder} value={farmName} onChange={(event) => setFarmName(event.target.value)} /></span></label>
        <label>{messages.passwordLabel}<span className="input-shell"><LockKeyhole size={14} /><input type={showPassword ? 'text' : 'password'} placeholder={messages.passwordPlaceholder} value={password} onChange={handlePassword} onBlur={() => setError('password', validatePassword(password))} aria-invalid={Boolean(errors.password)} /><button type="button" className="eye-button" aria-label={messages.showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button></span>{errors.password && <small role="alert">{errors.password}</small>}</label>
        <label>{messages.confirmPasswordLabel}<span className="input-shell"><LockKeyhole size={14} /><input type={showConfirm ? 'text' : 'password'} placeholder={messages.confirmPasswordPlaceholder} value={confirmPassword} onChange={handleConfirmPassword} onBlur={() => setError('confirmPassword', confirmPassword && confirmPassword === password ? '' : messages.validation.passwordsDoNotMatch)} aria-invalid={Boolean(errors.confirmPassword)} /><button type="button" className="eye-button" aria-label={messages.showConfirmPassword} onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}</button></span>{errors.confirmPassword && <small role="alert">{errors.confirmPassword}</small>}</label>
        <label className="terms"><input type="checkbox" /><span>{messages.agreementPrefix} <a href="#terms">{messages.termsAndConditions}</a> {messages.agreementJoiner} <a href="#privacy">{messages.privacyPolicy}</a></span></label>
        {submitError && <small role="alert">{submitError}</small>}
        <button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Creating account…' : messages.submit}</button>
      </form>
      <p className="login-copy">{messages.existingAccount} <a href="#login" onClick={onLogin}>{messages.login}</a></p>
    </div>
    <aside className="feature-side"><div className="features-list">
      <Feature icon={<ShieldCheck />} title={messages.features.secureTitle} text={messages.features.secureDescription} />
      <Feature icon={<ChartNoAxesCombined />} title={messages.features.monitoringTitle} text={messages.features.monitoringDescription} />
      <Feature icon={<Headphones />} title={messages.features.supportTitle} text={messages.features.supportDescription} />
    </div><img className="farm-illustration" src={farmIllustration} alt={messages.farmImageAlt} /></aside>
  </section></main>;
}

function Feature({ icon, title, text }) { return <div className="feature"><span className="feature-icon">{icon}</span><strong>{title}</strong><p>{text}</p></div>; }

