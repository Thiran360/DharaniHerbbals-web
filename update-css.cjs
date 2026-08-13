const fs = require('fs');
let css = fs.readFileSync('src/pages/Profile.css', 'utf8');

const startIdx = css.indexOf('/* --- MOBILE ALIGNMENT FIXES --- */');
if (startIdx !== -1) {
  css = css.substring(0, startIdx);
}

const newFixes = `
/* --- MOBILE ALIGNMENT FIXES --- */
@media (max-width: 768px) {
  /* Restore padding to clear the mobile navbar and search bar */
  .profile-page-wrapper {
    padding-top: 140px !important;
    align-items: center !important;
  }
  
  .saas-avatar {
    width: 64px !important;
    height: 64px !important;
    font-size: 1.75rem !important;
    margin: 0 auto !important;
  }
  
  .saas-profile-header {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    gap: 12px !important;
    margin-bottom: 16px !important;
  }
  
  /* Force horizontal scrolling, no wrapping */
  .saas-nav {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    justify-content: flex-start !important;
    gap: 8px !important;
    padding-bottom: 8px !important;
    width: 100% !important;
    -webkit-overflow-scrolling: touch !important;
  }
  
  .saas-nav::-webkit-scrollbar {
    display: none;
  }
  
  .saas-nav {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .saas-nav-item {
    flex: 0 0 auto !important;
    padding: 10px 14px !important;
    min-width: 50px !important;
    display: flex !important;
    justify-content: center !important;
  }
}
`;

fs.writeFileSync('src/pages/Profile.css', css + newFixes, 'utf8');
