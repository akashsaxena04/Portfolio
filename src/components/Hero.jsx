const Hero = () => {
  return (
    <section id="home" className="hero section-spacing">
      <div className="hero-content">
        <div className="profile-wrapper floating-profile">
          <div className="glow-effect"></div>
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <img
                src="/assets/profile.jpg"
                alt="Akash Saxena"
                className="profile-pic"
              />
            </div>
            <div className="flip-card-back">
              <img
                src="/assets/avatar.png"
                alt="Akash Avatar"
                className="profile-pic"
              />
            </div>
          </div>
        </div>
        <h1 className="hero-title gradient-text">
          <span className="greeting">Hi, I'm</span><br/>
          Akash Saxena
        </h1>
        <p className="hero-subtitle">Full Stack Developer</p>
        <p className="hero-about">
          A detail-oriented full stack developer specializing in the MERN stack. I blend strong algorithm fundamentals with modern tooling to build robust, scalable applications that solve complex problems and elevate user experiences.
        </p>
        <div className="hero-actions">
          <a href="#skills" className="btn primary">View Skills</a>
          <a href="#projects" className="btn primary">View Projects</a>
          <a href="#contact" className="btn primary">Contact Me</a>
        </div>
      </div>
    </section>
  );
};
export default Hero;
