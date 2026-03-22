import { useScrollReveal } from '../hooks/useScrollReveal';

const ProjectCard = ({ proj, idx }) => {
  const revealRef = useScrollReveal({ threshold: 0.1 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
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
    <article 
      ref={revealRef}
      className={`card glass-card glow-on-hover reveal reveal-delay-${(idx % 3) + 1}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ willChange: 'transform' }}
    >
      <div className="card-content">
        <h3>{proj.title}</h3>
        <p>{proj.description}</p>
        <p>{proj.highlights}</p>
        <p className="tech-stack"><strong>Tech Stack:</strong> {proj.tech}</p>
      </div>
    </article>
  );
};

const Projects = () => {
  const projects = [
    {
      title: 'WorkAxis – Employee Task Management System',
      description: 'Role-based employee task management platform for task assignment, deadline tracking, and real-time notifications, helping managers efficiently monitor workflows across teams.',
      highlights: 'Implemented secure authentication and protected API routes, reducing manual coordination and improving task completion efficiency.',
      tech: 'React.js, Node.js, Express.js, MongoDB, Tailwind CSS, Chart.js, JWT, REST APIs, MVC Architecture'
    },
    {
      title: 'RookieRise – Recruitment and Assessment Platform',
      description: 'Full-stack recruitment platform supporting candidate profiles, job postings, and online assessments through a centralized dashboard for recruiters.',
      highlights: 'Built scalable backend APIs enabling concurrent testing for 30+ candidates, significantly reducing manual recruitment effort.',
      tech: 'MongoDB, Express.js, React.js, Node.js, Tailwind CSS, JWT, REST APIs, MVC Architecture'
    },
    {
      title: 'LRU Cache Simulator – DSA Project',
      description: 'Implemented a Least Recently Used (LRU) cache simulator demonstrating efficient cache-based memory management with fast data retrieval.',
      highlights: 'Achieved O(1) time complexity for insertion and retrieval using a combination of HashMap and Doubly Linked List.',
      tech: 'C++, HashMap, Doubly Linked List'
    }
  ];

  return (
    <section id="projects" className="section section-alt">
      <div className="section-inner">
        <h2 className="section-title">Projects</h2>
        <div className="cards-grid">
          {projects.map((proj, idx) => (
            <ProjectCard key={idx} proj={proj} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default Projects;
