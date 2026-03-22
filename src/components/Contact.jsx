const Contact = () => {
  return (
    <section id="contact" className="section section-alt">
      <div className="section-inner">
        <h2 className="section-title">Contact</h2>
        <div className="contact-grid">
          <div className="contact-info">
            <p className="contact-text">
              I’m open to full-time roles, internships, and freelance opportunities in full stack development and backend engineering.
            </p>
            <p className="contact-text">
              Feel free to reach out if you’d like to discuss a project, collaboration, or opportunity.
            </p>
          </div>
          <div className="contact-card glass-card hover-lift">
            <div className="contact-item">
              <span className="contact-label">Email</span>
              <a href="mailto:akash.saxena1404@gmail.com" className="contact-link glow-text">akash.saxena1404@gmail.com</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Mobile</span>
              <a href="tel:+919634412955" className="contact-link glow-text">+91 96344 12955</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">LinkedIn</span>
              <a href="https://linkedin.com/in/akash04" target="_blank" rel="noopener noreferrer" className="contact-link glow-text">
                linkedin.com/in/akash04
              </a>
            </div>
            <div className="contact-item">
              <span className="contact-label">GitHub</span>
              <a href="https://github.com/akashsaxena04" target="_blank" rel="noopener noreferrer" className="contact-link glow-text">
                github.com/akashsaxena04
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Contact;
