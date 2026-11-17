import { useState } from "react";
import contactBg from "../assets/images/contact_bg.png";
import type { CSSProperties, FormEvent } from "react";
import "../App.css";
import {
  ArrowUpRight,
  Clock3,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";

const WHATSAPP_NUMBER = "27818659844";
const CONTACT_EMAIL = "mugumo44@gmail.com";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });

  const buildMessage = () =>
    [
      "Hello MugumoNems Projects,",
      "",
      `Full Name: ${form.name}`,
      `Email: ${form.email}`,
      `Company: ${form.company || "Not provided"}`,
      `Service Required: ${form.service}`,
      "",
      form.message,
    ].join("\n");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Website enquiry — ${form.service}`);
    const body = encodeURIComponent(buildMessage());
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      form.name.trim()
        ? buildMessage()
        : "Hello MugumoNems Projects, I would like to make an enquiry."
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="contact-ref-page">
      <section className="contact-ref-hero">
        <div
  className="contact-ref-hero-image"
  style={
    {
      "--contact-hero-image": `url(${contactBg})`,
    } as CSSProperties
  }
  aria-hidden="true"
/>
        <div className="contact-ref-hero-content">
          <p className="contact-ref-kicker">GET IN TOUCH</p>
          <h1>
            Let’s Create
            <br />
            Something <strong>Remarkable.</strong>
          </h1>
          <p className="contact-ref-hero-copy">
            Have a question, a project idea, or a custom order?
            <br />
            We’d love to hear from you.
          </p>
          <span className="contact-ref-hero-rule" />
        </div>
      </section>

      <section className="contact-ref-content">
        <aside className="contact-ref-sidebar">
          <a className="contact-ref-info-row" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
            <span className="contact-ref-info-icon"><MessageCircle /></span>
            <span className="contact-ref-info-copy">
              <strong>WhatsApp</strong>
              <small>+27 81 865 9844</small>
            </span>
            <ArrowUpRight className="contact-ref-row-arrow" />
          </a>

          <a className="contact-ref-info-row" href={`mailto:${CONTACT_EMAIL}`}>
            <span className="contact-ref-info-icon"><Mail /></span>
            <span className="contact-ref-info-copy">
              <strong>Email</strong>
              <small>{CONTACT_EMAIL}</small>
            </span>
            <ArrowUpRight className="contact-ref-row-arrow" />
          </a>

          <a
  className="contact-ref-info-row"
  href="https://www.google.com/maps/dir/?api=1&destination=184+Birchfield+Complex%2C+Market+Street%2C+Grand+Central%2C+Midrand%2C+1682%2C+South+Africa"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Get directions to MugumoNems Projects"
>
  <span className="contact-ref-info-icon">
    <MapPin />
  </span>

  <span className="contact-ref-info-copy">
    <strong>Location</strong>
    <small>
      184 BIRCHFIELD COMPLEX
      <br />
      Market St, Grand Central, Midrand, 1682
    </small>
  </span>

  <ArrowUpRight className="contact-ref-row-arrow" />
</a>

          <div className="contact-ref-info-row">
            <span className="contact-ref-info-icon"><Clock3 /></span>
            <span className="contact-ref-info-copy">
              <strong>Business Hours</strong>
              <small>Mon – Fri: 08:00 – 17:00</small>
              <small>Sat: 09:00 – 13:00</small>
            </span>
          </div>

          <div className="contact-ref-socials">
            <h2>Connect with us</h2>
            <div className="contact-ref-social-buttons">
              
<div className="contact-ref-social-buttons">
  {/* TikTok */}
  <a
    href="https://www.tiktok.com/@mugumon?_r=1&_t=ZS-9BHvpXdGts8"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Visit our TikTok"
    title="TikTok"
    className="contact-ref-tiktok"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M19.6 7.2a6.8 6.8 0 0 1-4.2-1.5v9.1a6.3 6.3 0 1 1-6.3-6.3c.4 0 .8 0 1.2.1v3.5a2.8 2.8 0 1 0 1.7 2.6V2.5h3.5c.3 2.3 1.9 4 4.1 4.3z"/>
    </svg>
  </a>

  {/* Facebook */}
  <a
    href="https://www.facebook.com/share/18fdWE274S/?mibextid=wwXIfr"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Visit our Facebook"
    title="Facebook"
    className="contact-ref-facebook"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v1.8H7v3.1h2.8v8z"/>
    </svg>
  </a>

  {/* Instagram */}
  <a
    href="https://www.instagram.com/mugumonemsprojects?igsh=emwwM3hhcTFnOHNr&utm_source=qr"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Visit our Instagram"
    title="Instagram"
    className="contact-ref-instagram"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  </a>

  {/* Third-party website */}
  <a
    href="https://promoafrica.com/MUGUMONEMS"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Visit our third-party website"
    title="Promo Africa"
    className="contact-ref-websites"
  >
    <ExternalLink />
    <span>3rd Party<br />Websites</span>
  </a>
</div>

            </div>
          </div>
        </aside>

        <section className="contact-ref-form-card">
          <h2>Send an Enquiry</h2>
          <form onSubmit={handleSubmit} className="contact-ref-form">
            <div className="contact-ref-form-grid">
              <label>
                Full Name <span>*</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </label>
              <label>
                Email Address <span>*</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>
              <label>
                Company <small>(Optional)</small>
                <input
                  type="text"
                  value={form.company}
                  onChange={(event) => setForm({ ...form, company: event.target.value })}
                  placeholder="Your company"
                  autoComplete="organization"
                />
              </label>
              <label>
                Service Required <span>*</span>
                <select
                  value={form.service}
                  onChange={(event) => setForm({ ...form, service: event.target.value })}
                  required
                >
                  <option value="" disabled>Select a service</option>
                  <option>Branding & Graphic Design</option>
                  <option>Corporate Gifts & Promotional Products</option>
                  <option>Printing & Packaging</option>
                  <option>Product Supply</option>
                  <option>Custom Order</option>
                  <option>Other Enquiry</option>
                </select>
              </label>
            </div>

            <label className="contact-ref-message-label">
              Message <span>*</span>
              <textarea
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                placeholder="Tell us about your project or request..."
                rows={4}
                required
              />
            </label>

            <div className="contact-ref-form-actions">
              <button type="submit" className="contact-ref-send-button">
                <Send />
                Send Message
              </button>
              <span className="contact-ref-or"><i />or<i /></span>
              <button type="button" className="contact-ref-whatsapp-button" onClick={openWhatsApp}>
                <MessageCircle />
                Chat on WhatsApp
              </button>
            </div>
            <p className="contact-ref-form-note">
              Send Message opens your email app. Chat on WhatsApp opens a prepared message for our team.
            </p>
          </form>
        </section>
      </section>

      <section className="contact-ref-bottom-note">
        <Globe2 />
        <span>We look forward to creating something remarkable with you.</span>
      </section>
    </main>
  );
}


