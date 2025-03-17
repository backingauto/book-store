import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li>Home</li>
                        <li>About Us</li>
                        <li>FAQs</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Customer Support</h4>
                    <ul>
                        <li>Return & Refund Policy</li>
                        <li>Shipping Information</li>
                        <li>Privacy Policy</li>
                        <li>Terms & Conditions</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <p>support@bookstore.com</p>
                    <p>(123) 456-7890</p>
                    <p>123 Book Street, Library City, BK 56789</p>
                </div>

                <div className="footer-section">
                    <h4>Follow Us</h4>
                    <div className="social-icons">
                        <span>📘 Facebook</span>
                        <span>🐦 Twitter</span>
                        <span>📷 Instagram</span>
                        <span>🔗 LinkedIn</span>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2025 BookStore. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
