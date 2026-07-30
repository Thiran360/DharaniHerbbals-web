import { MessageCircle } from 'lucide-react';
import Chatbot from './Chatbot';
import './FloatingSocials.css';

function InstaIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

export default function FloatingSocials() {
  return (
    <div className="floating-socials-container">
      <a href="https://wa.me/919788122001" target="_blank" rel="noopener noreferrer" className="float-btn float-whatsapp">
        <MessageCircle size={28} />
      </a>
      <a href="https://www.instagram.com/dharani_herbbals?igsh=NG9sbTFidTdodzN2" target="_blank" rel="noopener noreferrer" className="float-btn float-instagram">
        <InstaIcon />
      </a>
      <Chatbot />
    </div>
  );
}
