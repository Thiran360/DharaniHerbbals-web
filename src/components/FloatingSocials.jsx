import { MessageCircle } from 'lucide-react';
import Chatbot from './Chatbot';
import './FloatingSocials.css';

function InstaIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="float-icon-svg"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function FloatingSocials() {
  return (
    <div className="floating-socials-container">
      <a href="https://wa.me/919788122001" target="_blank" rel="noopener noreferrer" className="float-btn float-whatsapp" aria-label="Chat on WhatsApp">
        <MessageCircle size={28} />
      </a>
      <a href="https://www.instagram.com/dharani_herbbals?igsh=NG9sbTFidTdodzN2" target="_blank" rel="noopener noreferrer" className="float-btn float-instagram" aria-label="Follow on Instagram">
        <InstaIcon />
      </a>
      <Chatbot />
    </div>
  );
}
