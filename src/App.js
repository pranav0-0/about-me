import React, { useState, useEffect, useRef } from "react";

function App() {
  const [activeSection, setActiveSection] = useState("about");
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Mutable refs for scroll-driven animation
  const scrollRef = useRef(null);
  const canvasRef = useRef(null);
  const triangleRef = useRef(null);
  const hexRef = useRef(null);
  const linesRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const tickingRef = useRef(false);
  const rafRef = useRef(null);

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll listener: update ref + rAF
  useEffect(() => {
    const onScroll = () => {
      const sc = scrollRef.current;
      if (!sc) return;
      const scrollTop = sc.scrollTop;
      const maxScroll = sc.scrollHeight - sc.clientHeight;
      const progress = Math.min(scrollTop / maxScroll, 1);

      scrollProgressRef.current = progress;
      if (!tickingRef.current) {
        tickingRef.current = true;
        rafRef.current = requestAnimationFrame(() => {
          drawGrid(scrollProgressRef.current);
          updateShapes(scrollProgressRef.current);
          tickingRef.current = false;
        });
      }

      // highlight nav
      const sections = ["about", "projects", "contact"];
      for (let id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    const scEl = scrollRef.current;
    if (scEl) scEl.addEventListener("scroll", onScroll);
    return () => {
      if (scEl) scEl.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, [isMobile]);

  // Draw grid logic
  function drawGrid(progress) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);

    const rows = isMobile ? 4 : 12;
    const cols = isMobile ? 6 : 18;

    const cellH = h / rows;
    const rawCellW = w / cols;
    const cellW = Math.max(rawCellW, cellH); // Ensure width >= height

    const rotation = progress * 30 * (Math.PI / 180);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const delay = (i + j) * 0.15;
        const intensity = Math.sin(progress * Math.PI * 2 + delay) * 0.5 + 0.5;
        const scale = 0.8 + intensity * 0.3;
        const opacity = 0.07 + intensity * 0.25;
        const borderWidth = intensity > 0.6 ? 1 : 0.5;
        const cx = j * cellW + cellW / 2;
        const cy = i * cellH + cellH / 2;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        ctx.translate(-cx, -cy);

        ctx.strokeStyle = `rgba(55,65,81,${opacity})`;
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(j * cellW, i * cellH, cellW, cellH);
        ctx.restore();
      }
    }
  }

  // Update geometric shapes
  function updateShapes(progress) {
    if (triangleRef.current) {
      triangleRef.current.style.transform = `rotate(${
        progress * 180
      }deg) scale(${1 + progress})`;
    }
    if (hexRef.current) {
      hexRef.current.style.transform = `rotate(${
        progress * -120
      }deg) scale(${1 + progress * 0.5})`;
    }
    if (linesRef.current) {
      linesRef.current.style.transform = `translateY(${
        progress * 200 - 100
      }px) rotate(${progress * 5}deg)`;
    }
  }

  // Close mobile menu on outside click
  useEffect(() => {
    const onClick = () => menuOpen && setMenuOpen(false);
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [menuOpen]);

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none will-change-transform"
      />

      <div className="fixed inset-0 z-10 pointer-events-none">
        <div
          ref={triangleRef}
          className={`absolute ${
            isMobile
              ? "top-10 left-4 border-l-[30px] border-r-[30px] border-b-[50px]"
              : "top-20 left-10 border-l-[50px] border-r-[50px] border-b-[80px]"
          } w-0 h-0 border-l-transparent border-r-transparent border-b-red-500 opacity-20 will-change-transform`}
        />
        <div
          ref={hexRef}
          className={`absolute ${
            isMobile
              ? "bottom-5 right-5 w-10 h-10 border-[2px]"
              : "bottom-20 right-10 w-20 h-20 border-[3px]"
          } border-red-500 opacity-40 will-change-transform`}
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        />
      </div>

      <div
        ref={scrollRef}
        className="relative z-20 w-full h-full overflow-y-scroll scroll-smooth"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {/* Responsive Header */}
        <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-red-500/20 flex items-center justify-between px-4 sm:px-6 py-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wider text-black">
            <span className="relative">
              pranav
              <div className="absolute -bottom-1 left-0 w-full h-px bg-red-500 transform origin-left transition-transform duration-300 hover:scale-x-100 scale-x-0"></div>
            </span>
          </h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 sm:space-x-6">
            {["about", "projects", "contact"].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`relative text-base sm:text-lg font-medium transition-colors duration-300 ${
                  activeSection === section
                    ? "text-red-500"
                    : "text-black hover:text-red-500"
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
                {activeSection === section && (
                  <div className="absolute -bottom-1 left-0 w-full h-px bg-red-500 animate-pulse"></div>
                )}
              </a>
            ))}
          </nav>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden relative z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="text-black focus:outline-none"
            >
              <div className="space-y-1 w-8">
                <span
                  className={`block w-6 h-0.5 bg-black transition-transform ${
                    menuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></span>
                <span
                  className={`block w-8 h-0.5 bg-black transition-opacity ${
                    menuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`block w-6 h-0.5 bg-black transition-transform ${
                    menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></span>
              </div>
            </button>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
              <div
                className="absolute right-0 mt-4 w-48 bg-white border border-red-500/20 rounded-md shadow-lg py-2"
                onClick={(e) => e.stopPropagation()}
              >
                {["about", "projects", "contact"].map((section) => (
                  <a
                    key={section}
                    href={`#${section}`}
                    className={`block px-4 py-2 text-base font-medium transition-colors duration-300 ${
                      activeSection === section
                        ? "text-red-500 bg-red-50"
                        : "text-black hover:text-red-500 hover:bg-gray-50"
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </a>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-16 sm:pt-20">
          {/* About Section */}
          <section
            id="about"
            className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 relative"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="text-center space-y-6 sm:space-y-8 max-w-4xl">
              <h2 className="text-5xl sm:text-7xl md:text-8xl font-bold text-black leading-tight">
                About{" "}
                <span className="text-red-500 relative">
                  Me
                  <div className="absolute inset-0 border-2 border-red-500 animate-pulse opacity-20"></div>
                </span>
              </h2>
              <div className="w-20 sm:w-24 h-1 bg-red-500 mx-auto"></div>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl">
                Hi, I'm{" "}
                <span className="text-red-500 font-semibold">Pranav</span>. I'm
                a data analyist and developer passionate about building
                intelligent systems and exploring the intersection of AI and
                technology. My work focuses on building and deploying
                intelligent, production-ready systems at the intersection of AI,
                cloud infrastructure, and modern web.
              </p>
            </div>
          </section>

          {/* Projects Section */}
          <section
            id="projects"
            className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 relative"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="text-center space-y-8 sm:space-y-12 max-w-6xl">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-6 sm:mb-8">
                Pro<span className="text-red-500">jects</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[
                  {
                    title: "Project Somi",
                    description:
                      "A browser extension designed to protect users from abusive or harmful language online by detecting and filtering toxic content in real time.",
                  },
                  {
                    title: "Truly Random Password Generator",
                    description:
                      "A secure password generator that leverages unpredictable user interactions to produce cryptographically strong passwords.",
                  },
                  {
                    title: "Exam Proctoring Application",
                    description:
                      "A web-based platform for monitoring online examinations, incorporating real-time video analytics and intelligent cheat detection mechanisms.",
                  },
                ].map((project, index) => (
                  <div
                    key={index}
                    className="group relative p-6 sm:p-8 bg-white border border-gray-200 hover:border-red-500 transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2"
                  >
                    <div className="absolute top-0 left-0 w-0 h-0 border-l-4 border-l-red-500 border-b-4 border-b-transparent group-hover:border-l-8 group-hover:border-b-8 transition-all duration-300"></div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-red-500 group-hover:text-black transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      {project.description}
                    </p>
                    <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-r border-b border-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section
            id="contact"
            className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 relative"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="text-center space-y-6 sm:space-y-8 max-w-2xl">
              <h2 className="text-5xl sm:text-7xl md:text-8xl font-bold text-black">
                Con<span className="text-red-500">tact</span>
              </h2>
              <div className="w-24 sm:w-32 h-1 bg-red-500 mx-auto"></div>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                want to learn more? Let's connect!
              </p>
              <div className="pt-6 sm:pt-8">
                <a
                  href="mailto:7pranav.chavan@gmail.com"
                  className="group relative inline-flex items-center px-8 sm:px-12 py-3 sm:py-4 bg-red-500 text-white font-semibold text-base sm:text-lg transition-all duration-300 hover:bg-white hover:text-red-500 border border-red-500"
                >
                  <span className="relative z-10">Email Me</span>
                  <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
