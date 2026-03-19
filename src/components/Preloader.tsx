import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();

    // Setup initial state
    gsap.set(textRef.current, { y: 50, opacity: 0 });
    gsap.set(progressRef.current, { scaleX: 0 });

    // Animate in
    tl.to(textRef.current, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
    })
    .to(progressRef.current, {
      scaleX: 1,
      duration: 1.5,
      ease: "power2.inOut",
    }, "-=0.5")
    // Animate out (zoom into the cosmos)
    .to(containerRef.current, {
      scale: 1.5,
      opacity: 0,
      duration: 0.8,
      ease: "power4.in",
      onComplete: () => {
        setIsDone(true);
      }
    });

  }, []);

  if (isDone) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] origin-center"
    >
      <div className="relative flex flex-col items-center">
        <h1 
          ref={textRef}
          className="text-[#FFC737] font-[Orbitron] text-5xl md:text-7xl tracking-[0.2em] mb-8"
          style={{ textShadow: "0 0 10px rgba(255, 199, 55, 0.5), 0 0 20px rgba(255, 199, 55, 0.3)" }}
        >
          AROHA
        </h1>
        
        {/* Loading Bar */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            ref={progressRef}
            className="w-full h-full bg-[#EB3322] origin-left"
          />
        </div>
        <p className="mt-4 text-xs tracking-widest text-[#F0F4FF]/50 font-mono uppercase">
          Initializing Cosmic Engine
        </p>
      </div>
    </div>
  );
}
