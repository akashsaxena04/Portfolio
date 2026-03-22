import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Only apply on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
      }

      const target = e.target;
      const isHoverable = target.closest('a, button, .hover-lift, .flip-card-inner');
      
      if (isHoverable) {
        dotRef.current?.classList.add('hovered');
        ringRef.current?.classList.add('hovered');
      } else {
        dotRef.current?.classList.remove('hovered');
        ringRef.current?.classList.remove('hovered');
      }
    };

    const onMouseDown = () => {
      dotRef.current?.classList.add('clicked');
      ringRef.current?.classList.add('clicked');
    };
    
    const onMouseUp = () => {
      dotRef.current?.classList.remove('clicked');
      ringRef.current?.classList.remove('clicked');
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot"></div>
      <div ref={ringRef} className="cursor-ring"></div>
    </>
  );
};
export default CustomCursor;
