import React from 'react';
import { Github, Linkedin, Instagram, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <p className="footer-text">
              Made with <Heart size={16} className="heart-icon" /> by Saif Sanadi
            </p>
            <p className="footer-subtitle">
              Hospital Management System - Internship Project
            </p>
          </div>
          
          <div className="social-links">
            <a 
              href="https://github.com/saifsanadi26" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link github"
            >
              <Github size={20} />
              <span>GitHub</span>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/saifsanadi/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link linkedin"
            >
              <Linkedin size={20} />
              <span>LinkedIn</span>
            </a>
            
            <a 
              href="https://www.instagram.com/saif_sanadi/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link instagram"
            >
              <Instagram size={20} />
              <span>Instagram</span>
            </a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Hospital Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
