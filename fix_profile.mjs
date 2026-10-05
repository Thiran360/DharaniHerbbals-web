import fs from 'fs';
let content = fs.readFileSync('src/pages/Profile.css', 'utf8');

const targetRegex = /@media \(max-width: 900px\) \{[\s\S]*?\.order-card-footer \{[\s\S]*?\.address-form \.form-row \{[\s\S]*?\}\r?\n\}/g;

const replacement = `@media (max-width: 900px) {
  .profile-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}
@media (max-width: 640px) {
  .order-card {
    padding: 20px;
  }
  .order-card-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  .order-card-title-group {
    width: 100%;
  }
  .order-card-title-group h3 {
    font-size: 1.05rem;
  }
  .order-card-footer {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  .btn-track-order, .btn-shop-now {
    width: 100%;
    text-align: center;
  }
  .address-form .form-row {
    flex-direction: column;
    gap: 20px;
  }
}`;

content = content.replace(targetRegex, replacement);
fs.writeFileSync('src/pages/Profile.css', content);
