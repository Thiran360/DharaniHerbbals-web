import { useMemo } from 'react';
import { Calendar as CalendarIcon, PackageCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './UsageCalendar.css';

const DAYS_OF_WEEK_EN = [
  { full: 'Sun', short: 'Sun' },
  { full: 'Mon', short: 'Mon' },
  { full: 'Tue', short: 'Tue' },
  { full: 'Wed', short: 'Wed' },
  { full: 'Thu', short: 'Thu' },
  { full: 'Fri', short: 'Fri' },
  { full: 'Sat', short: 'Sat' },
];

const DAYS_OF_WEEK_TA = [
  { full: 'ஞாயிறு', short: 'ஞா' },
  { full: 'திங்கள்', short: 'திங்' },
  { full: 'செவ்வாய்', short: 'செவ்' },
  { full: 'புதன்', short: 'புதன்' },
  { full: 'வியாழன்', short: 'வியா' },
  { full: 'வெள்ளி', short: 'வெள்' },
  { full: 'சனி', short: 'சனி' },
];

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTHS_TA = [
  'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
  'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
];

export default function UsageCalendar({ orders }) {
  const { language } = useLanguage();

  const daysOfWeek = language === 'ta' ? DAYS_OF_WEEK_TA : DAYS_OF_WEEK_EN;
  const months = language === 'ta' ? MONTHS_TA : MONTHS_EN;

  // Find the latest order date
  const latestOrderDate = useMemo(() => {
    if (!orders || orders.length === 0) return null;
    
    // Sort orders by created_at descending
    const sortedOrders = [...orders].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    
    return new Date(sortedOrders[0].created_at);
  }, [orders]);

  // Determine which month/year to show (default to current if no orders)
  const displayDate = latestOrderDate || new Date();
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  // Calendar logic
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Create array of days for the grid
  const days = [];
  
  // Padding for first week
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  
  // Actual days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Check if a day is the latest order
  const isLatestOrder = (day) => {
    if (!latestOrderDate || !day) return false;
    return (
      latestOrderDate.getDate() === day &&
      latestOrderDate.getMonth() === month &&
      latestOrderDate.getFullYear() === year
    );
  };

  return (
    <div className="usage-calendar-container">
      <div className="profile-content-header">
        <h1>{language === 'ta' ? 'பயன்பாட்டு நாட்காட்டி' : 'Usage Calendar'}</h1>
        <p>
          {language === 'ta'
            ? 'உங்கள் சமீபத்திய நல்வாழ்வுப் பயணம் மற்றும் ஆர்டர்களைக் கண்காணிக்கவும்.'
            : 'Track your recent wellness journey and latest orders.'}
        </p>
      </div>

      <div className="calendar-card">
        <div className="calendar-header">
          <div className="calendar-title">
            <CalendarIcon size={24} color="#22c55e" />
            <h2>{months[month]} {year}</h2>
          </div>
          
          {latestOrderDate && (
            <div className="latest-order-badge">
              <PackageCheck size={16} />
              <span>
                {language === 'ta' ? 'சமீபத்திய ஆர்டர்: ' : 'Latest Order: '}
                {latestOrderDate.toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="calendar-grid">
          {daysOfWeek.map((dayObj, index) => (
            <div key={index} className="calendar-day-header">
              <span className="day-name-full">{dayObj.full}</span>
              <span className="day-name-short">{dayObj.short}</span>
            </div>
          ))}

          {days.map((day, index) => {
            const isHighlight = isLatestOrder(day);
            return (
              <div
                key={index}
                className={`calendar-cell ${day ? 'has-date' : 'empty'} ${
                  isHighlight ? 'highlight-order' : ''
                }`}
              >
                {day && (
                  <>
                    <span className="date-number">{day}</span>
                    {isHighlight && (
                      <div className="highlight-tooltip">
                        {language === 'ta' ? 'சமீபத்திய ஆர்டர்' : 'Latest Order'}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {!latestOrderDate && (
          <div className="empty-orders-calendar">
            <p>
              {language === 'ta'
                ? 'நீங்கள் இன்னும் எந்த ஆர்டரையும் செய்யவில்லை. நீங்கள் ஆர்டர் செய்தவுடன், உங்கள் சமீபத்திய ஆர்டர் இங்கே குறிக்கப்படும்!'
                : "You haven't placed any orders yet. Once you do, your latest order will be highlighted here!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
