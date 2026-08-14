import React from 'react'
import "./PrivacyPolicy.css";
const PrivatePrivacy = ({ onBack }) => {
  return (
    <div className="privacy-page">
     <div className="privacy-policy">
        <button type="button" onClick={onBack} className="back-button">
          ← Back to login
        </button>
        <h1>Privacy Policy</h1>
         <p>
        <strong>Effective Date: March 5th, 2025</strong>
      </p>

      <h2>1. Introduction</h2>
      <p>
        Welcome to Chimertech.com. Your privacy is important to us, and we are
        committed to protecting the personal information you share with us.
        This Privacy Policy explains how we collect, use, store, and safeguard
        your data when you visit our website or use our services.
      </p>

      <h2>2. Information We Collect</h2>
      <p>We collect the following types of information:</p>

      <h3>Personal Information</h3>
      <p>
        Name, email address, phone number, shipping and billing address, and
        payment details when you make a purchase.
      </p>

      <h3>Account Information</h3>
      <p>
        If you create an account, we store your login credentials and
        preferences.
      </p>

      <h3>Browsing Information</h3>
      <p>
        IP address, browser type, operating system, device information, and
        website usage data via cookies and analytics tools.
      </p>

      <h3>Communication Data</h3>
      <p>
        When you contact us via email, chat, or forms, we store your
        communication for future reference.
      </p>

      <h3>Behavioral Data</h3>
      <p>
        Data related to your interactions with our website, pages visited, and
        engagement with marketing campaigns.
      </p>

      <h2>3. How We Use Your Information</h2>
      <p>We use your data for the following purposes:</p>

      <ul>
        <li>To process and fulfill orders, including payment and shipping.</li>
        <li>To provide customer support and respond to inquiries.</li>
        <li>
          To improve our website functionality, user experience, and services.
        </li>
        <li>
          To send marketing emails and promotional offers (you may opt out
          anytime).
        </li>
        <li>
          To ensure security, prevent fraud, and comply with legal obligations.
        </li>
      </ul>

      <h2>4. Data Storage &amp; Retention Period</h2>
      <p>
        We store your personal information on secure servers and retain it for
        as long as necessary to fulfill the purposes outlined in this policy.
      </p>

      <p>
        User data related to transactions is retained for a minimum of 5 years
        for legal and tax purposes.
      </p>

      <p>
        If you request account deletion, we will erase your personal
        information within 30 days, except where retention is required by law.
      </p>

      <h2>5. Data Sharing &amp; Third Parties</h2>
      <p>We do not sell your personal data. However, we may share information with:</p>

      <ul>
        <li>Payment Processors for secure transactions.</li>
        <li>Shipping Partners to fulfill your orders.</li>
        <li>
          Analytics and Marketing Providers to improve our website and services.
        </li>
        <li>Legal Authorities when required by law or to prevent fraud.</li>
      </ul>

      <p>
        We ensure all third-party service providers comply with data protection
        regulations.
      </p>

      <h2>6. Cookies, Tracking &amp; Behavioral Advertising</h2>
      <p>We use cookies and tracking technologies to:</p>

      <ul>
        <li>Enhance your browsing experience.</li>
        <li>Analyze website traffic and performance.</li>
        <li>
          Personalize content and ads based on browsing history (Behavioral
          Advertising).
        </li>
      </ul>

      <p>
        You can manage your cookie preferences through your browser settings or
        by using "Do Not Track" (DNT) settings.
      </p>

      <h2>7. Security &amp; Safety Measures</h2>
      <p>
        We implement robust security measures to protect your data from
        unauthorized access, alteration, or disclosure, including:
      </p>

      <ul>
        <li>SSL encryption for data transmission.</li>
        <li>Regular security audits and access controls.</li>
        <li>Two-factor authentication (2FA) for admin access.</li>
      </ul>

      <p>
        While we follow industry best practices, no system is 100% secure, and
        users should take precautions when sharing personal information online.
      </p>

      <h2>8. Your Rights &amp; Choices</h2>
      <p>Depending on your location, you may have the following rights:</p>

      <ul>
        <li>Access, update, or delete your personal data.</li>
        <li>Opt-out of marketing communications at any time.</li>
        <li>Request a copy of your data.</li>
        <li>Withdraw consent for data processing.</li>
      </ul>

      <p>
        To exercise these rights, contact us at{" "}
        <a href="mailto:research@chimertech.com">
          research@chimertech.com
        </a>
        .
      </p>

      <h2>9. Do Not Track (DNT) Policy</h2>
      <p>
        Our website respects Do Not Track (DNT) signals, and if your browser
        sends a DNT request, we do not track your browsing behavior for
        marketing or advertising purposes.
      </p>

      <h2>10. Casual Visitors Note</h2>
      <p>
        Visitors who browse the website without registering or making a
        purchase may still have data collected via cookies and analytics tools.
        We do not collect personally identifiable information unless you
        voluntarily submit it.
      </p>

      <h2>11. Third-Party Links</h2>
      <p>
        Our website may contain links to third-party websites. We are not
        responsible for their privacy practices and encourage you to review
        their policies before providing any personal information.
      </p>

      <h2>12. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will
        be posted on this page with an updated effective date.
      </p>

      <h2>13. Contact Us</h2>
      <p>
        For questions or concerns about this Privacy Policy, please contact us
        at{" "}
        <a href="mailto:research@chimertech.com">
          research@chimertech.com
        </a>
        .
      </p>
    </div>
    </div>
  )
}

export default PrivatePrivacy
