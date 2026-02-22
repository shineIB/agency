import { useState, useEffect, useRef } from "react";

// ─── Animation Hook ───
function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, isVisible];
}

function AnimateIn({ children, delay = 0, className = "", direction = "up" }) {
  const [ref, isVisible] = useInView();
  const transforms = {
    up: "translateY(48px)",
    left: "translateX(-48px)",
    right: "translateX(48px)",
    none: "translateY(0)",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0)" : transforms[direction],
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Grain Overlay ───
function GrainOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none",
        overflow: "hidden",
        opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// ─── Navbar ───
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { label: "Services", id: "services" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? "14px 0" : "22px 0",
        background: scrolled ? "rgba(8,8,14,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, #6366f1, #a855f7, #3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 16, color: "#fff", letterSpacing: -0.5,
          }}>C</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#fff", letterSpacing: -0.5 }}>
            Cast<span style={{ background: "linear-gradient(135deg, #818cf8, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Pair</span>
          </span>
        </div>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 36 }} className="hide-mobile">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{
                background: "none", border: "none", color: "rgba(255,255,255,0.6)",
                fontSize: 14, fontWeight: 500, cursor: "pointer", padding: 0,
                transition: "color 0.3s", letterSpacing: 0.2,
                fontFamily: "inherit",
              }}
              onMouseEnter={e => e.target.style.color = "#fff"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.6)"}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("contact")}
            style={{
              background: "linear-gradient(135deg, #6366f1, #7c3aed)",
              border: "none", color: "#fff", padding: "10px 24px",
              borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: "pointer",
              transition: "transform 0.3s, box-shadow 0.3s",
              boxShadow: "0 0 24px rgba(99,102,241,0.3)",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 0 32px rgba(99,102,241,0.5)"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 0 24px rgba(99,102,241,0.3)"; }}
          >
            Book a Call
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="show-mobile"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer", display: "none" }}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "rgba(8,8,14,0.96)", backdropFilter: "blur(20px)",
          padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", flexDirection: "column", gap: 20,
        }}>
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", fontSize: 16, fontWeight: 500, cursor: "pointer", textAlign: "left", padding: 0, fontFamily: "inherit" }}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("contact")}
            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", border: "none", color: "#fff", padding: "12px 28px", borderRadius: 50, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            Book a Call
          </button>
        </div>
      )}
    </nav>
  );
}

// ─── Hero Section ───
function Hero() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "120px 24px 80px",
    }}>
      {/* Ambient gradient orbs */}
      <div style={{
        position: "absolute", top: "-20%", left: "-10%", width: 600, height: 600,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", right: "-10%", width: 500, height: 500,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none",
      }} />
      {/* Grid pattern */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />

      <div style={{ maxWidth: 900, textAlign: "center", position: "relative", zIndex: 1 }}>
        <AnimateIn delay={0.1}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 20px", borderRadius: 50,
            background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
            marginBottom: 32,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", animation: "pulse-dot 2s infinite" }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)", letterSpacing: 0.5 }}>
              Influencer Marketing for AI Brands
            </span>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.25}>
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800,
            lineHeight: 1.05, letterSpacing: "-0.03em", color: "#fff",
            margin: "0 0 24px",
          }}>
            We connect{" "}
            <span style={{
              background: "linear-gradient(135deg, #818cf8, #a78bfa, #6366f1)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              AI brands
            </span>
            {" "}with the creators their audience already trusts.
          </h1>
        </AnimateIn>

        <AnimateIn delay={0.4}>
          <p style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "rgba(255,255,255,0.5)",
            lineHeight: 1.7, maxWidth: 600, margin: "0 auto 44px", fontWeight: 400,
          }}>
            CastPair is a Sweden-based agency specializing in YouTube sponsorship campaigns for AI & productivity tools. We pair brands with creators who deliver results.
          </p>
        </AnimateIn>

        <AnimateIn delay={0.55}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => scrollTo("contact")}
              style={{
                background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                border: "none", color: "#fff", padding: "16px 36px",
                borderRadius: 50, fontSize: 16, fontWeight: 600, cursor: "pointer",
                boxShadow: "0 0 40px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                transition: "transform 0.3s, box-shadow 0.3s",
                fontFamily: "inherit",
              }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = "0 0 56px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 0 40px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.15)"; }}
            >
              Start a Campaign →
            </button>
            <button
              onClick={() => scrollTo("services")}
              style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.8)", padding: "16px 36px",
                borderRadius: 50, fontSize: 16, fontWeight: 500, cursor: "pointer",
                transition: "all 0.3s", fontFamily: "inherit",
              }}
              onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              Our Services
            </button>
          </div>
        </AnimateIn>

        {/* Stats row */}
        <AnimateIn delay={0.7}>
          <div style={{
            display: "flex", justifyContent: "center", gap: "clamp(32px, 6vw, 72px)",
            marginTop: 72, flexWrap: "wrap",
          }}>
            {[
              { value: "AI & Tech", label: "Industry Focus" },
              { value: "YouTube", label: "Platform" },
              { value: "Sweden", label: "Based In" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#fff",
                  background: "linear-gradient(135deg, #c7d2fe, #fff)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4, fontWeight: 500, letterSpacing: 0.5 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

// ─── Services Section ───
function Services() {
  const services = [
    {
      icon: "📈",
      title: "Brand Campaigns",
      desc: "We help AI & tech brands run high-converting influencer campaigns that deliver real engagement, not vanity metrics. Strategic creator selection, authentic messaging, measurable ROI.",
      tags: ["Campaign Strategy", "Creator Matching", "Performance Tracking"],
    },
    {
      icon: "🎬",
      title: "Creator Partnerships",
      desc: "We help YouTube creators secure consistent, well-paying brand deals in the AI & productivity space. No cold pitching — we bring vetted opportunities directly to you.",
      tags: ["Brand Deals", "Rate Negotiation", "Long-term Partnerships"],
    },
    {
      icon: "🤝",
      title: "Authentic Alignment",
      desc: "Every campaign we run ensures genuine alignment between brand goals and creator vision. No forced integrations — only partnerships that feel natural and convert.",
      tags: ["Brand-Creator Fit", "Content Strategy", "Audience Trust"],
    },
  ];

  return (
    <section id="services" style={{ padding: "120px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)",
      }} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <AnimateIn>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <span style={{
              fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase",
              color: "#818cf8", display: "block", marginBottom: 16,
            }}>
              What We Do
            </span>
            <h2 style={{
              fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff",
              letterSpacing: "-0.02em", margin: 0, lineHeight: 1.1,
            }}>
              Full-service influencer marketing
              <br />
              <span style={{ color: "rgba(255,255,255,0.4)" }}>for the AI era.</span>
            </h2>
          </div>
        </AnimateIn>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: 24,
        }}>
          {services.map((s, i) => (
            <AnimateIn key={i} delay={0.15 * i}>
              <ServiceCard {...s} />
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon, title, desc, tags }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "linear-gradient(160deg, rgba(99,102,241,0.08), rgba(168,85,247,0.04))"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 20, padding: "40px 32px",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        cursor: "default", height: "100%",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.3)" : "none",
      }}
    >
      <div style={{
        fontSize: 36, marginBottom: 24,
        width: 64, height: 64, borderRadius: 16,
        background: "rgba(99,102,241,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 14px", letterSpacing: "-0.01em" }}>
        {title}
      </h3>
      <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "0 0 24px" }}>
        {desc}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {tags.map((t, i) => (
          <span key={i} style={{
            fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.5)",
            padding: "6px 14px", borderRadius: 50,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
          }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── About Section ───
function About() {
  return (
    <section id="about" style={{ padding: "120px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)",
      }} />
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <AnimateIn>
          <span style={{
            fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase",
            color: "#818cf8", display: "block", marginBottom: 16,
          }}>
            Why CastPair
          </span>
        </AnimateIn>
        <AnimateIn delay={0.15}>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, color: "#fff",
            letterSpacing: "-0.02em", margin: "0 0 32px", lineHeight: 1.15,
          }}>
            We don't do spray-and-pray campaigns.
          </h2>
        </AnimateIn>
        <AnimateIn delay={0.3}>
          <p style={{
            fontSize: "clamp(1rem, 1.8vw, 1.15rem)", color: "rgba(255,255,255,0.45)",
            lineHeight: 1.8, maxWidth: 700, margin: "0 auto 48px",
          }}>
            Based in Sweden, CastPair works exclusively within the AI & productivity niche on YouTube. We know the creators, we know the audience, and we know what converts. Every campaign is hand-curated — because authenticity isn't a buzzword to us, it's the business model.
          </p>
        </AnimateIn>
        <AnimateIn delay={0.45}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20, maxWidth: 700, margin: "0 auto",
          }}>
            {[
              { num: "01", text: "Deep niche expertise in AI tools & YouTube" },
              { num: "02", text: "Vetted creator roster with engaged audiences" },
              { num: "03", text: "Transparent pricing, no hidden fees" },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "28px 24px", borderRadius: 16,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                textAlign: "left",
              }}>
                <span style={{
                  fontSize: 13, fontWeight: 700, color: "#6366f1",
                  fontVariantNumeric: "tabular-nums",
                }}>{item.num}</span>
                <p style={{
                  fontSize: 14, color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.6, margin: "10px 0 0",
                }}>{item.text}</p>
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

// ─── Contact Section ───
function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.message) {
      const subject = encodeURIComponent(`Inquiry from ${formData.name}`);
      const body = encodeURIComponent(formData.message);
      window.open(`mailto:shine@castpair.com?subject=${subject}&body=${body}`, "_self");
    }
  };

  const inputStyle = {
    width: "100%", padding: "16px 20px", borderRadius: 14,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    color: "#fff", fontSize: 15, outline: "none",
    transition: "border-color 0.3s, background 0.3s",
    fontFamily: "inherit", boxSizing: "border-box",
  };

  return (
    <section id="contact" style={{ padding: "120px 24px 80px", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)",
      }} />
      {/* Ambient orb */}
      <div style={{
        position: "absolute", bottom: "-20%", left: "50%", transform: "translateX(-50%)",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <AnimateIn>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{
              fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase",
              color: "#818cf8", display: "block", marginBottom: 16,
            }}>
              Get in Touch
            </span>
            <h2 style={{
              fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff",
              letterSpacing: "-0.02em", margin: "0 0 16px", lineHeight: 1.1,
            }}>
              Let's build your
              <br />
              <span style={{
                background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>next campaign.</span>
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", margin: 0 }}>
              Whether you're a brand or a creator — we'd love to hear from you.
            </p>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.2}>
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 24, padding: "clamp(28px, 4vw, 44px)",
          }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
                <p style={{ color: "#818cf8", fontSize: 18, fontWeight: 600 }}>Message sent!</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
                  <input
                    type="text" placeholder="Your name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.4)"; e.target.style.background = "rgba(99,102,241,0.06)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                  />
                  <input
                    type="email" placeholder="Your email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.4)"; e.target.style.background = "rgba(99,102,241,0.06)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                  />
                </div>
                <textarea
                  placeholder="Tell us about your project..."
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
                  onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.4)"; e.target.style.background = "rgba(99,102,241,0.06)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                />
                <button
                  onClick={handleSubmit}
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                    border: "none", color: "#fff", padding: "16px 36px",
                    borderRadius: 50, fontSize: 16, fontWeight: 600, cursor: "pointer",
                    boxShadow: "0 0 32px rgba(99,102,241,0.3)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    fontFamily: "inherit", width: "100%",
                  }}
                  onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 0 48px rgba(99,102,241,0.45)"; }}
                  onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 0 32px rgba(99,102,241,0.3)"; }}
                >
                  Send Message
                </button>
              </div>
            )}
          </div>
        </AnimateIn>

        {/* Contact info */}
        <AnimateIn delay={0.35}>
          <div style={{
            display: "flex", justifyContent: "center", alignItems: "center",
            gap: 32, marginTop: 44, flexWrap: "wrap",
          }}>
            <a href="mailto:shine@castpair.com" style={{
              color: "rgba(255,255,255,0.5)", fontSize: 14, textDecoration: "none",
              transition: "color 0.3s", display: "flex", alignItems: "center", gap: 8,
            }}
              onMouseEnter={e => e.target.style.color = "#818cf8"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
            >
              ✉ shine@castpair.com
            </a>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

// ─── Footer ───
function Footer() {
  return (
    <footer style={{
      padding: "40px 24px", textAlign: "center",
      borderTop: "1px solid rgba(255,255,255,0.04)",
    }}>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", margin: 0 }}>
        © 2025 CastPair. All rights reserved.
      </p>
    </footer>
  );
}

// ─── Main App ───
export default function CastPair() {
  return (
    <>
      <GrainOverlay />
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
