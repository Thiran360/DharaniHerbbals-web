import { useLanguage } from '../context/LanguageContext';
import './OurJourney.css';
import teamPhoto from '../assets/grp.png';

export default function OurJourney() {
  const { t } = useLanguage();
  return (
    <div className="journey-editorial-container">
      <div className="journey-editorial-content">
        
        <p className="journey-ed-sub reveal" style={{animationDelay: '0.1s'}}>
          {t('journeySub')}
        </p>

        <p className="journey-ed-intro reveal" style={{animationDelay: '0.2s'}} dangerouslySetInnerHTML={{ __html: t('journeyIntro') }} />

        <h2 className="journey-ed-quote reveal" style={{animationDelay: '0.3s'}}>
          {t('journeyQuote')}
        </h2>

        <div className="journey-ed-narrative">
          <p className="reveal" style={{animationDelay: '0.4s'}}>
            {t('journeyP1')}
          </p>
          
          <p className="reveal" style={{animationDelay: '0.5s'}}>
            {t('journeyP2')}
          </p>
          
          <p className="reveal" style={{animationDelay: '0.6s'}}>
            {t('journeyP3')}
          </p>
        </div>

        <div className="journey-ed-image-wrapper reveal" style={{animationDelay: '0.7s'}}>
          <img src={teamPhoto} alt="Our Journey" className="journey-ed-image" loading="lazy" decoding="async" />
        </div>

        <p className="journey-ed-closing reveal" style={{animationDelay: '0.8s'}}>
          {t('journeyClosing')}
        </p>

      </div>
    </div>
  );
}
