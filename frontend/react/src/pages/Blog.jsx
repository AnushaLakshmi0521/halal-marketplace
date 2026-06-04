
import React, { useEffect } from 'react';
// Path adjusted to go up one level to src/assets/
import animation1 from '../assets/animation1.mp4'; 

const Blog = () => {
  // Logic for the scroll-reveal animations down the page
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="blog-page-container">
      {/* ─── STYLES (No Modules - Inline Style Tag) ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

        :root {
          --green: #3E6B1F; --green-light: #7BAF3A; --green-dark: #284812;
          --gold: #C9922A; --gold-light: #E8B84B; --cream: #F5F0E8;
          --cream-dark: #EDE5D4; --border: #DDD5C5; --ink: #1A1F12;
          --ink-soft: #4a5240; --ink-muted: #7a7a6a; --dark-bg: #111A0C;
          --card-bg: #ffffff;
        }

        .blog-page-container {
          background: var(--cream);
          color: var(--ink);
          font-family: "DM Sans", sans-serif;
          line-height: 1.7;
          position: relative;
        }

        /* Grain Overlay */
        .blog-page-container::before {
          content: ""; position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 1000; opacity: 0.4;
        }

        /* ─── NEW TWO-COLUMN SPLIT HEADER BACKDROP ─── */
        .split-header-section {
          background: var(--green);
          padding: 80px 8vw;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr; /* Left column slightly wider for typography */
          gap: 40px;
          align-items: center;
          min-height: 70vh;
        }

        /* Left Side Text & Pop Up Animation Rules */
        .split-header-text {
          color: #ffffff;
          opacity: 0;
          transform: translateY(20px);
          animation: popUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .split-header-text .kicker {
          color: var(--green-light);
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 12px;
          font-weight: 700;
          display: block;
          margin-bottom: 12px;
        }

        .split-header-text h1 {
          font-family: "Playfair Display", serif;
          font-size: clamp(32px, 4vw, 52px);
          line-height: 1.15;
          margin-bottom: 20px;
          font-weight: 800;
        }

        .split-header-text h1 em {
          font-style: italic;
          color: var(--gold-light);
        }

        .split-header-text p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 16px;
          max-width: 500px;
          line-height: 1.6;
        }

        /* Right Side Video Setup (Zero Cropping Window) */
        .split-header-video-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 700px;
        }

        .split-video-container {
          width: 100%;
          max-width: 1500px; /* Restricts width so height scales perfectly short */
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          line-height: 0;
        }

        .split-video-element {
          width: 100%;
          height: auto;
          object-fit: contain; /* Absolute guarantee against edge cropping */
        }

        /* CSS Keyframe for the Pop-up entry effect */
        @keyframes popUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Hero Styling */
        .hero {
          min-height: 60vh; background: var(--dark-bg);
          position: relative; display: grid; place-items: center;
          overflow: hidden; padding: 60px 5vw; text-align: center;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .hero-blob::before {
          content: ""; position: absolute; top: -20%; left: -10%; width: 70%; height: 70%;
          background: radial-gradient(ellipse, rgba(62,107,31,0.28) 0%, transparent 70%);
          animation: blobDrift 12s ease-in-out infinite alternate;
          border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
        }

        @keyframes blobDrift { from { transform: translate(0,0); } to { transform: translate(3%,4%); } }

        .hero-h1 {
          font-family: "Playfair Display", serif; font-size: clamp(32px, 4.5vw, 56px);
          font-weight: 900; color: #fff; line-height: 1.15; margin-bottom: 26px;
        }

        /* Article Styling */
        .article { max-width: 740px; margin: 0 auto; padding: 80px 5vw 100px; }
        
        .intro-pull {
          font-family: "Playfair Display", serif; font-size: 23px; font-style: italic;
          border-left: 4px solid var(--green); padding-left: 28px; margin-bottom: 52px; color: var(--ink-soft);
        }

        /* Pillars & Grid Styling */
        .pillar-grid { display: grid; gap: 14px; margin: 38px 0; }
        .pillar {
          background: var(--card-bg); border: 1px solid var(--border);
          border-radius: 14px; padding: 24px 28px; display: flex; gap: 22px; transition: 0.3s;
        }
        .pillar:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(62,107,31,0.1); }

        /* Stats Styling */
        .stat-trio { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin: 42px 0; }
        .stat-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 14px; padding: 28px 22px; text-align: center; }
        .stat-num { font-family: "Playfair Display", serif; font-size: 38px; font-weight: 800; color: var(--green); }

        /* Comparison Table Styling */
        .compare-wrap { margin: 40px 0; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 50px rgba(0,0,0,0.1); }
        .compare-header { display: grid; grid-template-columns: 1fr 1fr; background: var(--dark-bg); text-align: center; color: #fff; padding: 10px; font-size: 11px; font-weight: bold; }
        .compare-body { display: grid; grid-template-columns: 1fr 1fr; }
        .compare-col { padding: 28px; color: #fff; }
        .col-left { background: #1e2718; border-right: 1px solid rgba(255,255,255,0.05); }
        .col-right { background: var(--green-dark); }

        /* Highlight Band */
        .highlight-band {
            background: linear-gradient(130deg, var(--green-dark) 0%, var(--green) 55%, var(--green-light) 100%);
            border-radius: 18px; padding: 44px 48px; margin: 42px 0; color: #fff; position: relative;
        }

        /* Animations */
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease; }
        .reveal.on { opacity: 1; transform: translateY(0); }

        /* Responsive Breakpoint for Small Screens */
        @media (max-width: 868px) {
          .split-header-section { grid-template-columns: 1fr; text-align: center; padding: 60px 5vw; gap: 30px;}
          .split-header-text p { margin: 0 auto; }
          .compare-header, .compare-body, .stat-trio { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ─── NEW SPLIT INTRO SECTION (Text left popping up, Animation right) ─── */}
      <section className="split-header-section">
        <div className="split-header-text">
          <span className="kicker">Pure & Wholesome</span>
          <h1>A New Way to Think About Your <em>Daily Nutrition</em></h1>
          <p>
            Welcome to our blog space. Here, we break down the deeper layers of clean eating, mindful consumption, and food tracking that goes well beyond standard ingredients.
          </p>
        </div>
        
        <div className="split-header-video-wrap">
          <div className="split-video-container">
            <video 
              className="split-video-element"
              src={animation1}
              autoPlay 
              loop 
              muted 
              playsInline
            />
          </div>
        </div>
      </section>

      {/* ─── HERO BRAND STATEMENT SECTION ─── */}
      <section className="hero">
        <div className="hero-blob"></div>
        <div className="hero-inner">
          <h2 className="hero-h1">Why Halal & Tayyib is the standard for everyone.</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto' }}>
            Beyond basic requirements lies a standard of absolute purity, ethical stewardship, and wholesome nutrition.
          </p>
        </div>
      </section>

      {/* ─── MAIN ARTICLE ─── */}
      <article className="article">
        <div className="intro-pull">
          "Tayyib" means more than just permissible. It implies goodness, purity, and ethical integrity from seed to shelf.
        </div>

        <p>In the modern food landscape, we are often overwhelmed by labels. Organic, Non-GMO, and Fair Trade all try to solve parts of a broken system. The standard of <strong>Halal & Tayyib</strong> represents an integrated approach.</p>

        {/* THE PILLARS */}
        <h2 style={{ fontFamily: 'Playfair Display', fontSize: '32px', margin: '40px 0 20px' }}>The Three Pillars</h2>
        <div className="pillar-grid">
          <div className="pillar reveal">
            <div style={{ fontSize: '40px', color: 'var(--green)', opacity: 0.3 }}>01</div>
            <div className="pillar-body">
              <h3>Ethical Sourcing</h3>
              <p>Ensuring every ingredient is grown with respect for the land and the farmer.</p>
            </div>
          </div>
          <div className="pillar reveal">
            <div style={{ fontSize: '40px', color: 'var(--green)', opacity: 0.3 }}>02</div>
            <div className="pillar-body">
              <h3>Pure Ingredients</h3>
              <p>Free from synthetic additives, harmful chemicals, and hidden fillers.</p>
            </div>
          </div>
          <div className="pillar reveal">
            <div style={{ fontSize: '40px', color: 'var(--green)', opacity: 0.3 }}>03</div>
            <div className="pillar-body">
              <h3>Transparency</h3>
              <p>Full traceability from the source to your table, verified at every step.</p>
            </div>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="stat-trio reveal">
          <div className="stat-card">
            <div className="stat-num">90%</div>
            <div className="stat-desc">Industrial food contains additives</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">100%</div>
            <div className="stat-desc">Tayyib products are natural</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">0</div>
            <div className="stat-desc">Hidden synthetic ingredients</div>
          </div>
        </div>

        {/* COMPARISON TABLE */}
        <h2 style={{ fontFamily: 'Playfair Display', fontSize: '32px', margin: '40px 0 20px' }}>The Difference</h2>
        <div className="compare-wrap reveal">
          <div className="compare-header">
            <div>Standard Industrial</div>
            <div style={{ color: 'var(--green-light)' }}>Hal Tayyib Standard</div>
          </div>
          <div className="compare-body">
            <div className="compare-col col-left">
               <ul style={{listStyle:'none', padding:0}}>
                  <li style={{marginBottom:'10px'}}>• Efficiency over health</li>
                  <li style={{marginBottom:'10px'}}>• Opaque sourcing</li>
                  <li>• Synthetic preservatives</li>
               </ul>
            </div>
            <div className="compare-col col-right">
                <ul style={{listStyle:'none', padding:0}}>
                  <li style={{marginBottom:'10px'}}>• Health over convenience</li>
                  <li style={{marginBottom:'10px'}}>• Transparent supply chains</li>
                  <li>• Nutrient density focus</li>
               </ul>
            </div>
          </div>
        </div>

        {/* HIGHLIGHT BAND */}
        <div className="highlight-band reveal">
          <h3>A Universal Message</h3>
          <p>Principles of Purity and Goodness are universal values that protect the health of all people and the planet.</p>
        </div>

        {/* CTA */}
        <section style={{ background: 'var(--dark-bg)', padding: '60px 40px', borderRadius: '22px', textAlign: 'center', marginTop: '60px' }}>
          <h2 style={{ color: '#fff', fontFamily: 'Playfair Display', fontSize: '30px' }}>Good Food. <em style={{ color: 'var(--gold-light)' }}>Honestly Made.</em></h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '30px', maxWidth:'450px', margin:'0 auto 30px' }}>
             Hal Tayyib is building the first grocery platform that holds every product to the full clean-food standard.
          </p>
          <a href="https://instagram.com/haltayyib.official" style={{ background: 'var(--green)', color: '#fff', padding: '14px 38px', borderRadius: '32px', textDecoration: 'none', fontWeight: 'bold', display:'inline-block' }}>Follow Our Journey</a>
        </section>
      </article>
    </div>
  );
};

export default Blog;