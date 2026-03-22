import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      background: {
        color: { value: "transparent" },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: true, mode: "repulse" },
        },
        modes: {
          push: { quantity: 3 },
          repulse: { distance: 120, duration: 0.4 },
        },
      },
      particles: {
        color: { value: ["#00f0ff", "#7000ff", "#ff007f"] },
        links: {
          color: "#00f0ff",
          distance: 140,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "bounce" },
          random: false,
          speed: 0.8,
          straight: false,
        },
        number: {
          density: { enable: true, width: 800, height: 800 },
          value: 60,
        },
        opacity: { value: 0.4 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
      },
      detectRetina: true,
    }),
    []
  );

  if (init) {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -2, pointerEvents: "none" }}>
        <Particles id="tsparticles" options={options} />
      </div>
    );
  }

  return <></>;
};

export default ParticlesBackground;
