import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Contact = () => {
  const revealRef = useScrollReveal();
  const [formData, setFormData] = useState({ name: '', subject: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:akash.saxena1404@gmail.com?subject=${encodeURIComponent(formData.subject || 'Portfolio Contact')}&body=${encodeURIComponent(`Name: ${formData.name}\n\nMessage:\n${formData.message}`)}`;
    window.location.href = mailtoLink;
  };

  return (
    <section id="contact" className="section section-alt">
      <div className="section-inner">
        <h2 className="section-title">Contact</h2>
        <div ref={revealRef} className="contact-grid reveal">
          <div className="contact-info">
            <p className="contact-text">
              I’m open to full-time roles, internships, and freelance opportunities in full stack development and backend engineering.
            </p>
            <p className="contact-text">
              Feel free to reach out if you’d like to discuss a project, collaboration, or opportunity.
            </p>
            
            <div className="contact-card glass-card hover-lift mt-2">
              <div className="contact-item">
                <span className="contact-label">Email</span>
                <a href="mailto:akash.saxena1404@gmail.com" className="contact-link glow-text">akash.saxena1404@gmail.com</a>
              </div>
              <div className="contact-item mt-1">
                <span className="contact-label">Mobile</span>
                <a href="tel:+919634412955" className="contact-link glow-text">+91 96344 12955</a>
              </div>
              <div className="contact-item mt-1">
                <span className="contact-label">LinkedIn</span>
                <a href="https://linkedin.com/in/akash-saxena04" target="_blank" rel="noopener noreferrer" className="contact-link glow-text">
                  linkedin.com/in/akash04
                </a>
              </div>
              <div className="contact-item mt-1">
                <span className="contact-label">GitHub</span>
                <a href="https://github.com/akashsaxena04" target="_blank" rel="noopener noreferrer" className="contact-link glow-text">
                  github.com/akashsaxena04
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-container glass-card hover-lift">
            <h3 className="form-title">Send a Message</h3>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder="Opportunity..." />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows="5" placeholder="Hi Akash, I would like to..."></textarea>
              </div>
              <button type="submit" className="btn primary pulse-effect submit-btn">Send Mail</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
