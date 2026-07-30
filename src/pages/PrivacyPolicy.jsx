import React, { useEffect } from 'react';
import './PrivacyPolicy.css';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-policy-page">
      <div className="privacy-policy-header">
        <h1>Privacy Policy</h1>
        <p className="effective-date">Effective Date: July 11, 2026</p>
      </div>
      
      <div className="privacy-policy-content">
        <section className="policy-section">
          <h2>1. About Dharani Herbbals</h2>
          <p>
            At Dharani Herbbals, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. Customer/User Information Collection</h2>
          <p>We may collect the following information when you use our website or services.</p>
          
          <h3>A. Personal Information</h3>
          <ul>
            <li>Full Name</li>
            <li>Mobile Number</li>
            <li>Email Address</li>
            <li>Billing Address</li>
            <li>Shipping Address</li>
            <li>State and PIN Code</li>
            <li>Username and Password (where account registration is available)</li>
          </ul>

          <h3>B. Order & Payment Information</h3>
          <p>To process your orders, we may collect:</p>
          <ul>
            <li>Order Details</li>
            <li>Purchased Products</li>
            <li>Transaction Reference Number</li>
            <li>Payment Status</li>
            <li>Delivery Preferences</li>
          </ul>

          <h3>C. Technical Information</h3>
          <p>When you access our website, we may automatically collect:</p>
          <ul>
            <li>IP Address</li>
            <li>Browser Type</li>
            <li>Device Information</li>
            <li>Operating System</li>
            <li>Device Identifier</li>
            <li>Date and Time of Visit</li>
            <li>Website Usage Logs</li>
          </ul>

          <h3>D. Website Usage Information</h3>
          <p>We may collect information such as:</p>
          <ul>
            <li>Products viewed</li>
            <li>Search history</li>
            <li>Shopping cart activity</li>
            <li>Purchase history</li>
            <li>Login activity</li>
            <li>Customer support requests</li>
            <li>Website interaction and browsing behavior</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. Use of Information</h2>
          <p>The information collected may be used to:</p>
          <ul>
            <li>Process and deliver your orders.</li>
            <li>Verify payments and transactions.</li>
            <li>Manage your customer account.</li>
            <li>Provide customer support.</li>
            <li>Send order confirmations, invoices, and delivery updates.</li>
            <li>Improve our products, services, and website functionality.</li>
            <li>Personalize your shopping experience.</li>
            <li>Inform you about new products, offers, and promotions where permitted by applicable law.</li>
            <li>Detect, prevent, and investigate fraudulent or unauthorized activities.</li>
            <li>Comply with legal, regulatory, tax, and accounting obligations.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>4. Third-Party Disclosure</h2>
          <p>Dharani Herbbals does <strong>not</strong> sell, rent, or trade your personal information.</p>
          <p>Your information may be shared only when necessary with trusted third parties such as:</p>
          <ul>
            <li>Authorized Payment Gateway Providers</li>
            <li>Courier and Logistics Partners</li>
            <li>Cloud Hosting and IT Service Providers</li>
            <li>SMS and Email Communication Providers</li>
            <li>Government Authorities or Regulatory Bodies where disclosure is required under applicable law</li>
          </ul>
          <p>All third-party service providers are expected to maintain appropriate confidentiality and security standards.</p>
        </section>

        <section className="policy-section">
          <h2>5. Information Protection</h2>
          <p>
            We implement appropriate administrative, technical, and organizational measures to safeguard your personal information against unauthorized access, disclosure, alteration, misuse, or destruction.
          </p>
          <p>Our security measures include:</p>
          <ul>
            <li>SSL (HTTPS) encrypted communication</li>
            <li>Secure payment gateway integration</li>
            <li>Access controls for authorized personnel</li>
            <li>Regular system monitoring and security updates</li>
            <li>Reasonable safeguards against unauthorized access</li>
          </ul>
          <p>
            While we strive to protect your information, no method of transmission over the internet or electronic storage is completely secure. Therefore, we cannot guarantee absolute security.
          </p>
        </section>

        <section className="policy-section">
          <h2>6. Rights of Users</h2>
          <p>Subject to applicable laws of India, you have the right to:</p>
          <ul>
            <li>Access your personal information.</li>
            <li>Request correction or updating of inaccurate or incomplete information.</li>
            <li>Request deletion of your personal information where permitted by law.</li>
            <li>Withdraw consent for receiving promotional communications.</li>
            <li>Contact us regarding any privacy-related concern or grievance.</li>
          </ul>
          <p>We will respond to such requests within a reasonable period in accordance with applicable law.</p>
        </section>

        <section className="policy-section">
          <h2>7. Cookies Policy</h2>
          <p>Dharani Herbbals uses cookies and similar technologies to improve your browsing experience and website functionality.</p>
          <p>Cookies are used to:</p>
          <ul>
            <li>Maintain secure login sessions.</li>
            <li>Remember customer preferences.</li>
            <li>Store shopping cart information.</li>
            <li>Improve website performance.</li>
            <li>Analyze website traffic and visitor behavior.</li>
            <li>Enhance the overall customer experience.</li>
          </ul>
          <p>
            You may disable cookies through your browser settings. However, some features of the website may not function properly if cookies are disabled.
          </p>
        </section>

        <section className="policy-section">
          <h2>8. Data Retention</h2>
          <p>We retain your personal information only for as long as necessary to:</p>
          <ul>
            <li>Process and fulfil your orders.</li>
            <li>Maintain customer accounts.</li>
            <li>Provide customer support.</li>
            <li>Comply with applicable legal, tax, and accounting obligations.</li>
            <li>Resolve disputes and enforce our legal agreements.</li>
          </ul>
          <p>
            After the applicable retention period, your information will be securely deleted or anonymized in accordance with applicable laws.
          </p>
        </section>

        <section className="policy-section">
          <h2>9. Children's Privacy</h2>
          <p>
            Our website and services are intended for individuals who are <strong>18 years of age or older</strong>.
          </p>
          <p>
            We do not knowingly collect personal information from children. If we become aware that personal information belonging to a child has been collected, we will take appropriate steps to delete such information.
          </p>
        </section>

        <section className="policy-section">
          <h2>10. Changes to this Privacy Policy</h2>
          <p>Dharani Herbbals reserves the right to modify or update this Privacy Policy at any time.</p>
          <p>
            Any changes will be posted on this page together with the updated Effective Date. Continued use of the website after such changes constitutes your acceptance of the revised Privacy Policy.
          </p>
        </section>

        <section className="policy-section">
          <h2>11. Governing Law & Jurisdiction</h2>
          <p>
            This Privacy Policy shall be governed by and interpreted in accordance with the laws of <strong>India</strong>, including the <strong>Digital Personal Data Protection Act, 2023</strong>, the <strong>Information Technology Act, 2000</strong>, and other applicable laws.
          </p>
          <p>
            Any dispute arising out of or relating to this Privacy Policy shall be subject to the exclusive jurisdiction of the competent courts in the <strong>State of Tamil Nadu, India</strong>, where Dharani Herbbals carries on its principal business.
          </p>
        </section>

        <section className="policy-section">
          <h2>12. Refund Policy</h2>
          <p>
            At Dharani Herbbals, customer satisfaction is important to us. Refunds or replacements will be considered only if the product received is damaged, defective, expired, or incorrect.
          </p>
          <p>
            Customers must notify us within 48 hours of receiving the product by providing relevant photographs or proof of purchase. Once the request is verified and approved, the refund will be processed to the original payment method within 7–10 business days, depending on the payment provider or bank.
          </p>
          <p>
            Products that have been opened, used, altered, or damaged due to customer misuse are not eligible for refunds or returns.
          </p>
        </section>

        <section className="policy-section">
          <h2>13. Shipping & Delivery Policy</h2>
          <p>
            At Dharani Herbbals, we are committed to delivering your orders accurately, in good condition, and always on time.
          </p>
          <ul>
            <li><strong>Order Processing Time:</strong> All orders are processed and dispatched within 1 to 2 business days (excluding Sundays and public holidays) after receiving your order confirmation email.</li>
            <li><strong>Delivery Time:</strong> Depending on your location within India, delivery usually takes 3 to 7 business days from the date of dispatch.</li>
            <li><strong>Shipping Charges:</strong> Shipping charges for your order will be calculated and displayed at checkout.</li>
            <li><strong>Order Tracking:</strong> Once your order has shipped, you will receive an email and/or SMS notification containing your tracking number and a link to track your package.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>14. Cancellation Policy</h2>
          <p>
            We understand that you may occasionally change your mind about a purchase.
          </p>
          <ul>
            <li><strong>Before Dispatch:</strong> You can cancel your order at any time before it has been dispatched from our warehouse. To cancel your order, please contact us immediately at <strong>info@dharaniherbbals.in</strong> or call us at <strong>+91 97881 22001 / +91 99655 32001</strong>. If your payment was already processed, a full refund will be initiated to your original method of payment within 5-7 business days.</li>
            <li><strong>After Dispatch:</strong> Once an order has been dispatched or handed over to the courier partner, it cannot be cancelled. In this case, please refer to our Refund Policy.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>15. Terms & Conditions</h2>
          <ul>
            <li><strong>Product Information:</strong> We strive to ensure all product descriptions, images, and prices are accurate. However, minor variations may occur.</li>
            <li><strong>Orders & Payments:</strong> All orders are subject to availability and confirmation. Full payment must be completed before order processing.</li>
            <li><strong>Pricing:</strong> Prices are listed in INR and may be updated without prior notice.</li>
            <li><strong>Shipping & Delivery:</strong> Delivery timelines are estimates and may vary depending on your location and courier services.</li>
            <li><strong>Returns & Refunds:</strong> Returns and refunds are governed by our Return & Refund Policy.</li>
            <li><strong>Intellectual Property:</strong> All website content, including text, images, logos, and designs, is the property of Dharani Herbbals and may not be copied or reproduced without permission.</li>
            <li><strong>User Responsibilities:</strong> Users agree to provide accurate information and use the website only for lawful purposes.</li>
            <li><strong>Limitation of Liability:</strong> Dharani Herbbals is not responsible for delays, interruptions, or losses caused by circumstances beyond our control.</li>
            <li><strong>Privacy:</strong> Your personal information is collected and processed in accordance with our Privacy Policy.</li>
            <li><strong>Changes to Terms:</strong> We reserve the right to modify these Terms & Conditions at any time. Continued use of the website constitutes acceptance of the updated terms.</li>
          </ul>
        </section>

        <section className="policy-section contact-section">
          <h2>16. Contact Us</h2>
          <p>If you have any questions, concerns, or requests regarding our policies or the handling of your personal information, please contact us:</p>
          <div className="contact-details">
            <p><strong>Dharani Herbbals</strong></p>
            {/* Registered Office Address for Payment Gateway Approval */}
            <p><strong>Registered Office:</strong> 7/470, West Nehru Nagar, Punjai Puliampatti, Erode, Tamil Nadu, India - 638 459</p>
            <p><strong>Founder:</strong> A. Poonkodi</p>
            <p><strong>Email:</strong> <a href="mailto:info@dharaniherbbals.in">info@dharaniherbbals.in</a></p>
            <div className="contact-phone-row">
              <strong className="contact-phone-label">Phone:</strong>
              <div className="contact-phone-numbers">
                <span>+91 97881 22001</span>
                <span className="contact-phone-separator"> / </span>
                <span>+91 99655 32001</span>
              </div>
            </div>
            <p><strong>Website:</strong> <a href="https://www.vedanmart.com" target="_blank" rel="noopener noreferrer">https://www.vedanmart.com</a></p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
