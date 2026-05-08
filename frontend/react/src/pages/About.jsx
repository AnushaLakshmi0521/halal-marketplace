import React from 'react';
// Import the image from your assets folder
import aboutimg from '../assets/aboutimg.jpeg'; 
import { useNavigate } from "react-router-dom";

const About = () => {
  // CSS styles converted from the original source tokens and classes
  const navigate = useNavigate();
  const styles = {
    container: {
      background: '#F5F0E8',
      color: '#1A1F12',
      fontFamily: '"DM Sans", sans-serif',
      lineHeight: '1.7',
      position: 'relative',
      overflowX: 'hidden',
    },
    hero: {
      minHeight: '100vh',
      background: '#0F1A09',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      padding: '100px 6vw 80px',
    },
    section: { padding: '90px 6vw' },
    sectionDark: { background: '#0F1A09', color: '#fff' },
    sectionInner: { maxWidth: '1080px', margin: '0 auto' },
    titleSerif: { fontFamily: '"Playfair Display", serif', fontWeight: 800 },
    gold: { color: '#E8B84B' },
  };

  return (
    <div style={styles.container}>
      {/* ─── HERO SECTION ─── */}
      <section style={styles.hero}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '680px' }}>
          <div style={{ color: '#E8B84B', fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', marginBottom: '20px' }}>
            ESTABLISHED 2024
          </div>
          <h1 style={{ ...styles.titleSerif, fontSize: 'clamp(38px, 5.5vw, 70px)', color: '#fff', lineHeight: '1.06' }}>
            Crafting the <br /> <em style={{ fontStyle: 'italic', color: '#E8B84B' }}>Standard of Pure.</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '17px', margin: '42px 0' }}>
            At Hal Tayyib, we believe that what you consume defines your vitality. We bridge the gap between ancient ethical wisdom and modern wellness.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ padding: '7px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,.12)', color: '#fff', fontSize: '11px' }}>Premium Quality</span>
            <span style={{ padding: '7px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,.12)', color: '#fff', fontSize: '11px' }}>Ethically Sourced</span>
          </div>
        </div>
      </section>

      {/* ─── OUR LEGACY SECTION ─── */}
      <section style={styles.section}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#3E6B1F', fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px' }}>OUR LEGACY</span>
            <h2 style={{ ...styles.titleSerif, fontSize: '46px', margin: '20px 0' }}>Driven by Purpose</h2>
            <p style={{ fontStyle: 'italic', borderLeft: '4px solid #3E6B1F', paddingLeft: '24px', fontSize: '22px', marginBottom: '28px' }}>
              "Tayyib is more than just 'permissible'—it is the pursuit of excellence, wholesomeness, and absolute purity in every grain."
            </p>
            <p>
              Hal Tayyib was born out of a necessity for transparency in the food industry. We specialize in sourcing the finest natural goods, ensuring they meet the highest spiritual and health standards.
            </p>
          </div>
          {/* Updated Image Container */}
          <div style={{ height: '450px', borderRadius: '20px', overflow: 'hidden' }}>
            <img 
              src={aboutimg} 
              alt="About Us Legacy" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        </div>

        {/* ─── MISSION PILLARS ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '60px' }}>
          {[
            { title: "Ethical Sourcing", text: "We partner directly with farmers who respect the earth and their workers." },
            { title: "Absolute Purity", text: "Zero additives, zero compromises. Only the raw essence of nature." },
            { title: "Global Integrity", text: "Serving health-conscious individuals across the globe with integrity." }
          ].map((item, i) => (
            <div key={i} style={{ padding: '36px', background: '#fff', border: '1px solid #DDD5C5', borderRadius: '18px' }}>
              <h3 style={styles.titleSerif}>{item.title}</h3>
              <p style={{ fontSize: '14px', margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── STANDARDS COMPARISON (DARK) ─── */}
      <section style={{ ...styles.section, ...styles.sectionDark }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ color: '#E8B84B', fontSize: '10px', letterSpacing: '2.5px' }}>OUR PHILOSOPHY</span>
          <h2 style={styles.titleSerif}>The Pillars of Tayyib</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '20px', alignItems: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,.04)', padding: '28px', borderRadius: '16px' }}>
            <h3 style={{ color: '#fff' }}>Traditional Standards</h3>
            <ul style={{ color: 'rgba(255,255,255,.6)', fontSize: '13px' }}>
              <li>Basic compliance</li>
              <li>Mass production focus</li>
              <li>Minimal transparency</li>
            </ul>
          </div>
          <div style={{ color: 'rgba(255,255,255,.2)', fontStyle: 'italic', fontWeight: 700 }}>VS</div>
          <div style={{ background: 'rgba(62,107,31,.12)', padding: '28px', borderRadius: '16px', border: '1px solid rgba(123,175,58,.25)' }}>
            <h3 style={{ color: '#fff' }}>Hal Tayyib Standard</h3>
            <ul style={{ color: 'rgba(255,255,255,.6)', fontSize: '13px' }}>
              <li>Wholesome sourcing</li>
              <li>Ethical stewardship</li>
              <li>Absolute Purity</li>
            </ul>
          </div>
        </div>

        {/* ─── STATS ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', marginTop: '60px', gap: '2px' }}>
          {[
            { n: "100%", d: "PURE INGREDIENTS" },
            { n: "20+", d: "GLOBAL PARTNERS" },
            { n: "0", d: "ARTIFICIAL ADDITIVES" },
            { n: "2024", d: "YEAR ESTABLISHED" }
          ].map((s, i) => (
            <div key={i} style={{ padding: '36px', background: 'rgba(255,255,255,.03)', textAlign: 'center' }}>
              <div style={{ ...styles.titleSerif, fontSize: '44px', color: '#7BAF3A' }}>{s.n}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.35)' }}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TIMELINE SECTION ─── */}
      <section style={styles.section}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ ...styles.titleSerif, textAlign: 'center' }}>Our Journey</h2>
          <div style={{ position: 'relative', paddingLeft: '36px', marginTop: '48px', borderLeft: '2px solid #3E6B1F' }}>
            <div style={{ marginBottom: '36px' }}>
              <div style={{ color: '#3E6B1F', fontWeight: 700, fontSize: '10px' }}>2024 - THE VISION</div>
              <h3>Establishing Foundations</h3>
              <p>Defining the Tayyib standard for a new generation of conscious consumers.</p>
            </div>
            <div>
              <div style={{ color: '#7BAF3A', fontWeight: 700, fontSize: '10px' }}>FUTURE - EXPANSION</div>
              <h3>Global Wholesomeness</h3>
              <p>Bringing our philosophy of purity to health markets worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section style={styles.section}>
        <div style={{ background: '#0F1A09', borderRadius: '24px', padding: '70px 60px', textAlign: 'center', color: '#fff' }}>
          <h2 style={{ ...styles.titleSerif, fontSize: '38px' }}>Experience <em style={{ color: '#E8B84B', fontStyle: 'italic' }}>Pure Living.</em></h2>
          <p style={{ color: 'rgba(255,255,255,.5)', maxWidth: '480px', margin: '0 auto 32px' }}>
            Join us in our journey toward a more wholesome and transparent way of nourishing our bodies.
          </p>
          <button  onClick={() => navigate("/products")} style={{ background: '#3E6B1F', color: '#fff', padding: '14px 36px', borderRadius: '30px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            Explore Our Collection
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;