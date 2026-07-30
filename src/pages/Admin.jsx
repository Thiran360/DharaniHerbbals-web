import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Bell,
  Search
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

// Dummy Data
const statCards = [
  { title: 'Total Revenue', value: '₹4,25,000', increase: '+15.2%', icon: DollarSign, color: 'emerald' },
  { title: 'Active Orders', value: '142', increase: '+8.4%', icon: ShoppingCart, color: 'blue' },
  { title: 'Customers', value: '2,845', increase: '+12.1%', icon: Users, color: 'purple' },
  { title: 'Conversion Rate', value: '4.8%', increase: '+1.2%', icon: TrendingUp, color: 'orange' },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'Sriram', date: 'Today, 10:30 AM', amount: '₹1,250', status: 'Processing' },
  { id: '#ORD-002', customer: 'Deepika', date: 'Today, 09:15 AM', amount: '₹840', status: 'Shipped' },
  { id: '#ORD-003', customer: 'Arjun Kumar', date: 'Yesterday', amount: '₹2,100', status: 'Delivered' },
  { id: '#ORD-004', customer: 'Priya Raj', date: 'Yesterday', amount: '₹450', status: 'Processing' },
  { id: '#ORD-005', customer: 'Karthik', date: '08 Jun 2026', amount: '₹3,400', status: 'Delivered' },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Basic logout logic
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand" style={{ justifyContent: 'center', padding: '32px 24px' }}>
          <img src="/logo.png" alt="Dharani Herbbals Logo" style={{ width: '140px', height: 'auto', objectFit: 'contain' }} />
        </div>

        <nav className="admin-nav">
          <ul>
            <li className={activeTab === 'Dashboard' ? 'active' : ''} onClick={() => setActiveTab('Dashboard')}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </li>
            <li className={activeTab === 'Orders' ? 'active' : ''} onClick={() => setActiveTab('Orders')}>
              <ShoppingCart size={20} />
              <span>Orders</span>
              <span className="admin-badge">12</span>
            </li>
            <li className={activeTab === 'Products' ? 'active' : ''} onClick={() => setActiveTab('Products')}>
              <Package size={20} />
              <span>Products</span>
            </li>
            <li className={activeTab === 'Customers' ? 'active' : ''} onClick={() => setActiveTab('Customers')}>
              <Users size={20} />
              <span>Customers</span>
            </li>
            <li className="nav-divider"></li>
            <li className={activeTab === 'Settings' ? 'active' : ''} onClick={() => setActiveTab('Settings')}>
              <Settings size={20} />
              <span>Settings</span>
            </li>
          </ul>
        </nav>

        <div className="admin-logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-top-header">
          <div className="admin-search-bar">
            <Search size={18} color="#9ca3af" />
            <input type="text" placeholder="Search orders, customers, or products..." />
          </div>

          <div className="admin-header-actions">
            <button className="admin-icon-btn">
              <Bell size={20} />
              <span className="admin-notification-dot"></span>
            </button>
            <div className="admin-profile">
              <div className="admin-avatar">AD</div>
              <span>Admin User</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="admin-content-area">
          <div className="admin-page-header">
            <h1>Welcome back, Admin 👋</h1>
            <p>Here's what's happening with your store today.</p>
          </div>

          {/* Stats Grid */}
          <div className="admin-stats-grid">
            {statCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="admin-stat-card">
                  <div className="admin-stat-header">
                    <span className="admin-stat-title">{stat.title}</span>
                    <div className={`admin-stat-icon-box bg-${stat.color}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <div className="admin-stat-body">
                    <h2>{stat.value}</h2>
                    <div className="admin-stat-increase">
                      <ArrowUpRight size={16} />
                      {stat.increase} <span className="admin-stat-vs">vs last month</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Orders Table */}
          <div className="admin-table-container">
            <div className="admin-table-header">
              <h2>Recent Orders</h2>
              <button className="admin-btn-outline">View All</button>
            </div>
            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, idx) => (
                    <tr key={idx}>
                      <td className="admin-td-bold">{order.id}</td>
                      <td>{order.customer}</td>
                      <td className="admin-td-muted">{order.date}</td>
                      <td className="admin-td-bold">{order.amount}</td>
                      <td>
                        <span className={`admin-status-pill status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
