import { useMemo } from 'react';
import { Calendar as CalendarIcon, PackageCheck } from 'lucide-react';
import './UsageCalendar.css';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function UsageCalendar({ orders }) {
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
        <h1>Usage Calendar</h1>
        <p>Track your recent wellness journey and latest orders.</p>
      </div>

      <div className="calendar-card">
        <div className="calendar-header">
          <div className="calendar-title">
            <CalendarIcon size={24} color="#22c55e" />
            <h2>{MONTHS[month]} {year}</h2>
          </div>
          
          {latestOrderDate && (
            <div className="latest-order-badge">
              <PackageCheck size={16} />
              <span>Latest Order: {latestOrderDate.toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="calendar-grid">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="calendar-day-header">
              {day}
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
                      <div className="highlight-tooltip">Latest Order</div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {!latestOrderDate && (
          <div className="empty-orders-calendar">
            <p>You haven't placed any orders yet. Once you do, your latest order will be highlighted here!</p>
          </div>
        )}
      </div>
    </div>
  );
}
