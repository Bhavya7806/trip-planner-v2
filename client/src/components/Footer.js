// src/components/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>About TripPlanner</h3>
          <p>
            We believe travel should be about discovery, not stressful planning. 
            TripPlanner was born from a desire to make exploring the world easy and accessible for everyone.
          </p>
        </div>
        <div className="footer-section contact">
          <h3>Get In Touch</h3>
          <p>
            Have questions or feedback? We'd love to hear from you. 
            Reach out to our team at <a href="mailto:support@tripplanner.com">support@tripplanner.com</a>.
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} TripPlanner | All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;