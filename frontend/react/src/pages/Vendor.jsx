import React, { useEffect, useState } from 'react';

const Vendor = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Standard intersection observer for reveal animations
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
    <div className="vendor-container">
      {/* ─── STYLES (Single File, No Modules) ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

        :root {
          --g: #3E6B1F; --gl: #7BAF3A; --gd: #284812;
          --gold: #C9922A; --goldl: #E8B84B;
          --cream: #F5F0E8; --creamd: #EDE5D4;
          --border: #DDD5C5; --ink: #1A1F12;
          --soft: #4a5240; --dark: #111A0C;
        }

        .vendor-container { 
          background: var(--cream); 
          color: var(--ink); 
          font-family: "DM Sans", sans-serif; 
          line-height: 1.7; 
          position: relative; 
          min-height: 100vh;
        }
        
        /* Grain Overlay */
        .vendor-container::before {
          content: ""; position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 1000; opacity: 0.4;
        }

        .v-hero { 
          background: var(--dark); 
          min-height: 60vh; 
          display: grid; 
          place-items: center; 
          padding: 100px 5vw; 
          text-align: center; 
          color: #fff; 
          position: relative;
          overflow: hidden;
        }

        .v-hero h1 { font-family: "Playfair Display", serif; font-size: clamp(38px, 6vw, 68px); line-height: 1.1; margin-bottom: 20px; }
        .v-hero h1 em { color: var(--goldl); font-style: italic; }

        .v-section { max-width: 1200px; margin: 0 auto; padding: 80px 5vw; }
        
        .vendor-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
          gap: 30px; 
          margin-top: 50px; 
        }

        .vendor-card { 
          background: #fff; 
          border: 1px solid var(--border); 
          border-radius: 24px; 
          padding: 35px; 
          transition: all 0.4s ease; 
        }

        .vendor-card:hover { 
          transform: translateY(-8px); 
          box-shadow: 0 20px 40px rgba(62, 107, 31, 0.08); 
        }

        /* Modal */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(17, 26, 12, 0.95);
          display: flex; align-items: center; justify-content: center; z-index: 2000;
          padding: 20px; backdrop-filter: blur(8px);
        }

        .modal-content {
          background: var(--cream); width: 100%; max-width: 500px;
          border-radius: 28px; padding: 40px; position: relative;
        }

        .form-group { margin-bottom: 20px; text-align: left; }
        .form-group label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; color: var(--g); }
        .form-group input, .form-group textarea {
          width: 100%; padding: 14px; border: 1px solid var(--border); border-radius: 12px;
          background: #fff; font-family: inherit; font-size: 15px; outline: none;
        }

        .submit-btn {
          width: 100%; background: var(--g); color: #fff; padding: 16px;
          border: none; border-radius: 30px; font-weight: 700; cursor: pointer;
        }

        .reveal { opacity: 0; transform: translateY(20px); transition: 0.8s ease; }
        .reveal.on { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* ─── HERO ─── */}
      <section className="v-hero">
        <div className="reveal">
          <span style={{ color: 'var(--goldl)', letterSpacing: '3px', fontSize: '11px', textTransform: 'uppercase', display: 'block', marginBottom: '15px' }}>Partnership</span>
          <h1>Ethical Farmers. <br/><em>Honestly</em> Grown.</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '500px', margin: '0 auto' }}>Join the community built on the full Halal & Tayyib standard.</p>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <section className="v-section">
        <div style={{ textAlign: 'center', marginBottom: '60px' }} className="reveal">
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '42px' }}>Why Join Us?</h2>
        </div>
        
        <div className="vendor-grid">
          {/* Card 1 */}
          <div className="vendor-card reveal">
            <h3 style={{ fontFamily: 'Playfair Display', fontSize: '24px', marginBottom: '15px' }}>Direct Access</h3>
            <p style={{ fontSize: '14px', color: 'var(--soft)' }}>
              Skip the middleman and connect directly with families looking for Tayyib-standard food.
            </p>
          </div>

          {/* Card 2 */}
          <div className="vendor-card reveal">
            <h3 style={{ fontFamily: 'Playfair Display', fontSize: '24px', marginBottom: '15px' }}>Vetted Quality</h3>
            <p style={{ fontSize: '14px', color: 'var(--soft)' }}>
              Get the "Tayyib Verified" seal, a mark of purity and ethical excellence recognized by our community.
            </p>
          </div>

          {/* Card 3 */}
          <div className="vendor-card reveal">
            <h3 style={{ fontFamily: 'Playfair Display', fontSize: '24px', marginBottom: '15px' }}>Fair Value</h3>
            <p style={{ fontSize: '14px', color: 'var(--soft)' }}>
              We believe in fair trade. You set the value for your hard work and craftsmanship.
            </p>
          </div>
        </div>

        {/* APPLY SECTION */}
        <div className="reveal" style={{ marginTop: '80px', textAlign: 'center', background: 'var(--creamd)', padding: '80px 40px', borderRadius: '40px' }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '32px' }}>Ready to start?</h2>
          <p style={{ marginBottom: '35px', color: 'var(--soft)' }}>Our team visits every facility to ensure the highest Tayyib integrity.</p>
          <button 
            onClick={() => setShowModal(true)}
            style={{ background: 'var(--g)', color: '#fff', padding: '18px 45px', borderRadius: '40px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
          >
            Apply to Join as a Vendor
          </button>
        </div>
      </section>

      {/* ─── MODAL FORM ─── */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
            >
              &times;
            </button>
            <h2 style={{ fontFamily: 'Playfair Display', marginBottom: '5px' }}>Vendor Application</h2>
            <p style={{ fontSize: '13px', color: 'var(--soft)', marginBottom: '30px' }}>Tell us about your production standards.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); alert('Application sent! Our team will contact you.'); setShowModal(false); }}>
              <div className="form-group">
                <label>Business Name</label>
                <input type="text" placeholder="e.g. Green Valley Farm" required />
              </div>
              <div className="form-group">
                <label>What do you produce?</label>
                <input type="text" placeholder="e.g. Raw Honey, Organic Dates" required />
              </div>
              <div className="form-group">
                <label>Standards & Practices</label>
                <textarea rows="3" placeholder="Describe your ethical/farming methods..." required></textarea>
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input type="email" placeholder="contact@farm.com" required />
              </div>
              <button type="submit" className="submit-btn">Send Application</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendor;