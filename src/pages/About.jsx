import { useEffect } from 'react';
import { Leaf, Shield, Sparkles, Target, Eye, Heart, Award, Users, CheckCircle } from 'lucide-react';
import OurJourney from '../components/OurJourney';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import './About.css';

export default function About() {
  const { t } = useLanguage();
  useEffect(() => {
    window.scrollTo(0, 0);

    // Scroll Animation Observer for Reveal Elements
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger > *');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="about-hero-bg"></div>
        <div className="about-hero-content">
          <div className="about-badge">
            <Leaf size={16} /> {t('aboutBadge')}
          </div>
          <h1 className="about-title">
            <span>{t('aboutTitle')}</span>
          </h1>
          <p className="about-subtitle">
            {t('aboutSubtitle')}
          </p>
        </div>
      </div>

      {/* Our Journey Component - Moved to Top */}
      <div className="about-journey-wrapper">
        <OurJourney />
      </div>

      {/* Mission & History Cards Section */}
      <div className="about-cards-section">
        <div className="about-cards-grid">
          
          <div className="about-info-card">
            <div className="info-icon-circle green">
              <Target size={30} color="white" strokeWidth={2.5} />
            </div>
            <h2>{t('ourMission')}</h2>
            <p>
             {t('missionDesc')}
            </p>
          </div>

          <div className="about-info-card">
            <div className="info-icon-circle purple">
              <Eye size={30} color="white" strokeWidth={2.5} />
            </div>
            <h2>{t('ourHistory')}</h2>
            <p>
              {t('historyDesc')}
            </p>
          </div>

        </div>
      </div>

      {/* Core Values Section */}
      <div className="core-values-section">
        <div className="core-values-header">
          <h2>{t('coreValues')}</h2>
          <p>{t('coreValuesDesc')}</p>
        </div>
        
        <div className="core-values-grid">
          
          <div className="value-card">
            <div className="value-icon-circle red-light">
              <Heart size={24} color="#ef4444" strokeWidth={2} />
            </div>
            <h3>{t('val1Title')}</h3>
            <p>{t('val1Desc')}</p>
          </div>

          <div className="value-card">
            <div className="value-icon-circle green-light">
              <Shield size={24} color="#22c55e" strokeWidth={2} />
            </div>
            <h3>{t('val2Title')}</h3>
            <p>{t('val2Desc')}</p>
          </div>

          <div className="value-card">
            <div className="value-icon-circle blue-light">
              <Award size={24} color="#3b82f6" strokeWidth={2} />
            </div>
            <h3>{t('val3Title')}</h3>
            <p>{t('val3Desc')}</p>
          </div>

          <div className="value-card">
            <div className="value-icon-circle purple-light">
              <Users size={24} color="#a855f7" strokeWidth={2} />
            </div>
            <h3>{t('val4Title')}</h3>
            <p>{t('val4Desc')}</p>
          </div>

        </div>
      </div>


      <div className="about-stats-bar">
        <div className="stat-item">
          <div className="stat-number">{t('stat1Val')}</div>
          <div className="stat-label">{t('customersServed')}</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{t('stat2Val')}</div>
          <div className="stat-label">{t('stat2Label')}</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{t('stat3Val')}</div>
          <div className="stat-label">{t('stat3Label')}</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{t('stat4Val')}</div>
          <div className="stat-label">{t('legacyOfTrust')}</div>
        </div>
      </div>

      {/* What Makes Us Different */}
      <div className="different-section">
        <div className="different-header">
          <h2>{t('diffTitle')}</h2>
          <p>{t('diffDesc')}</p>
        </div>

        <div className="different-grid">
          
          <div className="different-card">
            <div className="different-icon-wrapper green-light">
              <Leaf size={22} color="#22c55e" strokeWidth={2} />
            </div>
            <div className="different-text">
              <h3>{t('featureTitle1')}</h3>
              <p>{t('featureDesc1')}</p>
            </div>
          </div>

          <div className="different-card">
            <div className="different-icon-wrapper blue-light">
              <Shield size={22} color="#3b82f6" strokeWidth={2} />
            </div>
            <div className="different-text">
              <h3>{t('featureTitle2')}</h3>
              <p>{t('featureDesc2')}</p>
            </div>
          </div>

          <div className="different-card">
            <div className="different-icon-wrapper purple-light">
              <Award size={22} color="#a855f7" strokeWidth={2} />
            </div>
            <div className="different-text">
              <h3>{t('featureTitle3')}</h3>
              <p>{t('featureDesc3')}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Our Commitment to You */}
      <div className="commitment-section">
        <div className="commitment-container">
          <h2 className="commitment-title">{t('commitTitle')}</h2>
          
          <div className="commitment-grid">
            
            <div className="commitment-item">
              <CheckCircle className="commitment-icon" size={24} color="#22c55e" strokeWidth={2} />
              <div className="commitment-text">
                <h3>{t('commit1Title')}</h3>
                <p>{t('commit1Desc')}</p>
              </div>
            </div>

            <div className="commitment-item">
              <CheckCircle className="commitment-icon" size={24} color="#22c55e" strokeWidth={2} />
              <div className="commitment-text">
                <h3>{t('commit2Title')}</h3>
                <p>{t('commit2Desc')}</p>
              </div>
            </div>

            <div className="commitment-item">
              <CheckCircle className="commitment-icon" size={24} color="#22c55e" strokeWidth={2} />
              <div className="commitment-text">
                <h3>{t('commit3Title')}</h3>
                <p>{t('commit3Desc')}</p>
              </div>
            </div>

            <div className="commitment-item">
              <CheckCircle className="commitment-icon" size={24} color="#22c55e" strokeWidth={2} />
              <div className="commitment-text">
                <h3>{t('commit4Title')}</h3>
                <p>{t('commit4Desc')}</p>
              </div>
            </div>

            <div className="commitment-item">
              <CheckCircle className="commitment-icon" size={24} color="#22c55e" strokeWidth={2} />
              <div className="commitment-text">
                <h3>{t('commit5Title')}</h3>
                <p>{t('commit5Desc')}</p>
              </div>
            </div>

            <div className="commitment-item">
              <CheckCircle className="commitment-icon" size={24} color="#22c55e" strokeWidth={2} />
              <div className="commitment-text">
                <h3>{t('commit6Title')}</h3>
                <p>{t('commit6Desc')}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Join Our Wellness Journey CTA */}
      <div className="about-cta-section">
        <div className="about-cta-box">
          <h2>{t('ctaTitle')}</h2>
          <p>
            {t('ctaDesc')}
          </p>
          <div className="about-cta-buttons">
            <button className="about-cta-btn-solid">{t('ctaBtn1')}</button>
            <button className="about-cta-btn-outline">{t('ctaBtn2')}</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
