const Resume = () => {
  return (
    <section id="resume" className="section">
      <div className="section-inner text-center">
        <h2 className="section-title center mx-auto">Resume</h2>
        <p className="resume-text">
          You can view or download my detailed resume using the links below.
        </p>
        <div className="hero-actions">
          <a
            className="btn primary pulse-effect"
            href="/cv-akash2.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
             View Resume
          </a>
          <a
            className="btn primary pulse-effect"
            href="/cv-akash2.pdf"
            download="Akash_Saxena_Resume.pdf"
          >
             Download PDF
          </a>
        </div>
      </div>
    </section>
  );
};
export default Resume;
