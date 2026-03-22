import { useScrollReveal } from '../hooks/useScrollReveal';

const SkillGroup = ({ group, idx }) => {
  const revealRef = useScrollReveal({ threshold: 0.2 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.transition = 'transform 0.5s ease-out';
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transition = 'none';
  };

  return (
    <div
      ref={revealRef}
      className={`skill-group glass-card reveal reveal-delay-${(idx % 3) + 1}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ willChange: 'transform' }}
    >
      <h3>{group.title}</h3>
      <ul>
        {group.items.map((skill, i) => (
          <li key={i}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};

const Skills = () => {
  const customSkills = [
    { title: 'Languages', items: ['C', 'C++', 'Python', 'JavaScript'] },
    { title: 'Frameworks & Libraries', items: ['React.js', 'Node.js', 'Express.js', 'Tailwind CSS'] },
    { title: 'Databases & ORM', items: ['MySQL', 'MongoDB'] },
    { title: 'Tools & Platforms', items: ['Git & GitHub', 'Vercel', 'Postman'] },
    { title: 'Soft Skills', items: ['Effective Presentation', 'Leadership', 'Team Collaboration', 'Decision Making'] }
  ];

  return (
    <section id="skills" className="section">
      <div className="section-inner">
        <h2 className="section-title">Skills</h2>
        <div className="skills-grid">
          {customSkills.map((group, idx) => (
            <SkillGroup key={idx} group={group} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default Skills;
