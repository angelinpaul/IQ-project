import React, { useState } from "react";
import "../styles/login.css";
import english from "../en.json";
import tamil from "../tn.json";
import hindi from "../hindi.json";
import kannada from "../styles/kannada.json";
import telugu from "../telugu.json";
import chimertechLogo from "../assets/logo.png";

const languages = [
  { code: "en", label: "English", messages: english },
  { code: "ta", label: "தமிழ்", messages: tamil },
  { code: "hi", label: "Hindi", messages: hindi },
  { code: "kn", label: "Kannada", messages: kannada },
  { code: "te", label: "Telugu", messages: telugu },
];

const Login = ({ languageCode, onCreateAccount, onTranslationsChange, onPrivacy, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const selectedLanguage = languages.find(({ code }) => code === languageCode) ?? languages[0];
  const messages = selectedLanguage.messages.login;
  const backgroundMessages = selectedLanguage.messages.background;

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!loginId.trim()) {
      newErrors.loginId = messages.loginIdRequired;
    }

    if (!password.trim()) {
      newErrors.password = messages.passwordRequired;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await onLogin({ loginId, password, rememberMe });
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setLoading(false);
    }
  };

  const selectLanguage = (code) => {
    const nextLanguage = languages.find((item) => item.code === code) ?? languages[0];
    onTranslationsChange(nextLanguage.messages, code);
    setErrors({});
    setLanguageOpen(false);
  };

  return (
    <div className="login-page">

      <img
        className="chimertech-logo"
        src={chimertechLogo}
        alt="Chimertech Private Limited"
      />

      {/* ================= LANGUAGE ================= */}

      <div className="language-wrapper">

          <button
            type="button"
            className="language-button"
            onClick={() =>
              setLanguageOpen(!languageOpen)
            }
          >
            <span className="globe">
              ◎
            </span>

            <span>{selectedLanguage.label}</span>

            <span className="language-arrow">
              {languageOpen ? "⌃" : "⌄"}
            </span>
          </button>


          {languageOpen && (
            <div className="language-menu">

              {languages.map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() =>
                    selectLanguage(code)
                  }
                >
                  {label}
                </button>
              ))}

            </div>
          )}

      </div>


      {/* ================= LOGIN CARD ================= */}
      <div className={`branding-text branding-${languageCode}`}>
              <h1>
                {backgroundMessages.headlineLineOne}<br />
                {backgroundMessages.headlineLineTwo}
              </h1>

              <p>
                {backgroundMessages.description}
              </p>
            </div>

      <section className="login-card">
        <div className="login-content">

          {/* Welcome */}

          <div className="welcome">

            <h2>
              {messages.welcome}
              <span className="wave">
                👋
              </span>
            </h2>

            <p>
              {messages.subtitle}
            </p>

          </div>


          {/* ================= FORM ================= */}

          <form onSubmit={handleLogin}>

            {/* MOBILE / EMAIL */}

            <div className="form-group">

              <label htmlFor="loginId">
                {messages.loginIdLabel}
              </label>

              <div
                className={`input-wrapper ${
                  errors.loginId
                    ? "input-error"
                    : ""
                }`}
              >

                <span className="input-icon">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle
                      cx="12"
                      cy="8"
                      r="3.5"
                    />

                    <path
                      d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"
                    />
                  </svg>

                </span>


                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => {
                    setLoginId(e.target.value);

                    if (errors.loginId) {
                      setErrors({
                        ...errors,
                        loginId: "",
                      });
                    }
                  }}
                  placeholder={messages.loginIdPlaceholder}
                  autoComplete="username"
                />

              </div>


              {errors.loginId && (
                <span className="error-message">
                  {errors.loginId}
                </span>
              )}

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label htmlFor="password">
                {messages.passwordLabel}
              </label>

              <div
                className={`input-wrapper ${
                  errors.password
                    ? "input-error"
                    : ""
                }`}
              >

                <span className="input-icon">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="2"
                    />

                    <path
                      d="M8 10V7a4 4 0 0 1 8 0v3"
                    />
                  </svg>

                </span>


                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);

                    if (errors.password) {
                      setErrors({
                        ...errors,
                        password: "",
                      });
                    }
                  }}
                  placeholder={messages.passwordPlaceholder}
                  autoComplete="current-password"
                />


                {/* EYE BUTTON */}

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >

                  {showPassword ? (

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M3 3l18 18" />

                      <path
                        d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                      />

                      <path
                        d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3.2 3.8"
                      />

                      <path
                        d="M6.3 6.3C3.6 8.2 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.3-1"
                      />
                    </svg>

                  ) : (

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                      />
                    </svg>

                  )}

                </button>

              </div>


              {errors.password && (
                <span className="error-message">
                  {errors.password}
                </span>
              )}

            </div>


            {/* ================= OPTIONS ================= */}

            <div className="login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                />

                <span className="custom-checkbox" />

                <span>
                  {messages.rememberMe}
                </span>

              </label>


              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  console.log(
                    "Forgot password"
                  )
                }
              >
                {messages.forgotPassword}
              </button>

            </div>


            {/* ================= LOGIN ================= */}

            {errors.form && <span className="error-message">{errors.form}</span>}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="loader" />
                  {messages.submitting}
                </>
              ) : (
                messages.submit
              )}

            </button>


            {/* ================= REGISTER ================= */}

            <div className="register-text">

              <span>
                {messages.newFarmer}
              </span>

              <button
                type="button"
                onClick={onCreateAccount}
              >
                {messages.createAccount}
              </button>

            </div>

          </form>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="footer">
        <button type="button" className="privacy-link" onClick={onPrivacy}>
          Privacy Policy
        </button>
        <span>{messages.footer}</span>
      </footer>

    </div>
  );
};

export default Login;


