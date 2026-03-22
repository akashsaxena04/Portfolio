const Certifications = () => {
  const certifications = [
    { title: 'Data Structure and Algorithms', issuer: 'Lovely Professional University', date: 'Aug 2025' },
    { title: 'Cloud Computing', issuer: 'NPTEL', date: 'May 2025' },
    { title: 'Programming Foundations with JavaScript, HTML and CSS', issuer: 'Coursera', date: 'Jun 2024' }
  ];

  return (
    <section id="certifications" className="section">
      <div className="section-inner">
        <h2 className="section-title">Certifications</h2>
        <div className="timeline">
          {certifications.map((cert, idx) => (
            <div className="timeline-item appear-anim" key={idx} style={{ animationDelay: `${idx * 0.15}s` }}>
              <div className="timeline-marker"></div>
              <div className="timeline-content glass-card">
                <h3>{cert.title}</h3>
                <p>{cert.issuer} &mdash; <span>{cert.date}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Certifications;
