import React, { useRef } from 'react';
import { Play } from 'lucide-react';
import './InstagramGallery.css';

function InstaIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none" />
    </svg>
  );
}

import p1 from '../assets/1.png';
import p2 from '../assets/2.png';
import p3 from '../assets/3.png';
import p4 from '../assets/4.png';
import p5 from '../assets/5.png';
import p6 from '../assets/6.png';
import s1 from '../assets/S1.jpeg';
import s2 from '../assets/S2.jpeg';
import s3 from '../assets/S3.jpeg';
import s4 from '../assets/S4.jpeg';
import s5 from '../assets/S5.jpeg';
import s6 from '../assets/S6.jpeg';

const instaPosts = [
  { id: 1, type: 'reel', image: p1, link: 'https://www.instagram.com/dharani_herbbals' },
  { id: 2, type: 'post', image: p2, link: 'https://www.instagram.com/dharani_herbbals' },
  { id: 3, type: 'reel', image: p3, link: 'https://www.instagram.com/dharani_herbbals' },
  { id: 4, type: 'post', image: p4, link: 'https://www.instagram.com/dharani_herbbals' },
  { id: 5, type: 'reel', image: p5, link: 'https://www.instagram.com/dharani_herbbals' },
  { id: 6, type: 'post', image: p6, link: 'https://www.instagram.com/dharani_herbbals' },
  { id: 7, type: 'post', image: s1, link: 'https://www.instagram.com/dharani_herbbals' },
  { id: 8, type: 'post', image: s2, link: 'https://www.instagram.com/dharani_herbbals' },
  { id: 9, type: 'post', image: s3, link: 'https://www.instagram.com/dharani_herbbals' },
  { id: 10, type: 'post', image: s4, link: 'https://www.instagram.com/dharani_herbbals' },
  { id: 11, type: 'post', image: s5, link: 'https://www.instagram.com/dharani_herbbals' },
  { id: 12, type: 'post', image: s6, link: 'https://www.instagram.com/dharani_herbbals' }
];

export default function InstagramGallery() {
  const scrollRef = useRef(null);

  return (
    <section className="instagram-section">
      <div className="insta-header-row">
        <div>
          <h2 className="insta-title">Follow Us on Instagram</h2>
          <p className="insta-subtitle">Discover our natural wellness journey</p>
        </div>
        <a href="https://www.instagram.com/dharani_herbbals" target="_blank" rel="noopener noreferrer" className="btn-insta-follow">
          <InstaIcon size={18} /> Follow Us
        </a>
      </div>

      <div className="insta-gallery-container" ref={scrollRef}>
        <div className="insta-track">
          {instaPosts.map(post => (
            <a key={post.id} href={post.link} target="_blank" rel="noopener noreferrer" className={`insta-card ${post.type}`}>
              <img src={post.image} alt="Instagram Post" className="insta-img" loading="lazy" />
              <div className="insta-overlay">
                <InstaIcon size={24} color="#fff" />
                <span>View on Instagram</span>
              </div>
              {post.type === 'reel' && (
                <div className="insta-play-icon">
                  <Play size={24} color="#fff" fill="#fff" />
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
