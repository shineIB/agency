import { useState, useEffect, useRef } from "react";

/* ============================================================
   CastPair - the pairing concept
   The site IS the product: brands on one side, creators on the
   other, CastPair as the line between. Editorial, high-contrast,
   type-led. Honest, illustrative pairings.
   ============================================================ */

const FONT_ID = "cp-fonts";
function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_ID)) return;
    const l = document.createElement("link");
    l.id = FONT_ID;
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Spline+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
}

const C = {
  bg: "#0a0a0b", ink: "#f4f4f2", mut: "rgba(244,244,242,0.55)", faint: "rgba(244,244,242,0.32)",
  line: "rgba(244,244,242,0.1)", lineSoft: "rgba(244,244,242,0.06)",
  brand: "#7BA7FF", creator: "#F5C26B", panel: "#101012",
  disp: "'Fraunces', Georgia, serif", body: "'Spline Sans', system-ui, sans-serif",
};

function useInView() {
  const ref = useRef(null); const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => e.isIntersecting && setV(true), { threshold: 0.2 });
    o.observe(el); return () => o.disconnect();
  }, []); return [ref, v];
}
function Reveal({ children, delay = 0, className = "", style = {} }) {
  const [ref, v] = useInView();
  return <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(22px)", transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}s, transform .8s cubic-bezier(.16,1,.3,1) ${delay}s`, ...style }}>{children}</div>;
}

function Nav() {
  const [s, setS] = useState(false); const [open, setOpen] = useState(false);
  useEffect(() => { const f = () => setS(window.scrollY > 28); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);
  const go = (id) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const links = [["Pairings", "pairings"], ["Approach", "approach"], ["Contact", "contact"]];
  return (
    <nav style={{ position: "fixed", inset: "0 0 auto 0", zIndex: 100, padding: s ? "13px 0" : "22px 0", background: s ? "rgba(10,10,11,0.7)" : "transparent", backdropFilter: s ? "blur(14px)" : "none", borderBottom: `1px solid ${s ? C.line : "transparent"}`, transition: "all .4s cubic-bezier(.16,1,.3,1)" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 30px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
          <span style={{ fontFamily: C.disp, fontSize: 21, fontWeight: 600, color: C.brand }}>Cast</span>
          <span style={{ width: 14, height: 1, background: C.line, margin: "0 2px" }} />
          <span style={{ fontFamily: C.disp, fontSize: 21, fontWeight: 600, color: C.creator }}>Pair</span>
        </div>
        <div className="cp-d" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {links.map(([l, id]) => <button key={id} onClick={() => go(id)} style={{ background: "none", border: "none", color: C.mut, fontFamily: C.body, fontSize: 14, cursor: "pointer", transition: "color .25s" }} onMouseEnter={(e) => (e.target.style.color = C.ink)} onMouseLeave={(e) => (e.target.style.color = C.mut)}>{l}</button>)}
          <button onClick={() => go("contact")} style={{ fontFamily: C.body, background: C.ink, color: C.bg, border: "none", padding: "9px 18px", fontSize: 14, fontWeight: 500, cursor: "pointer", borderRadius: 1 }}>Get in touch</button>
        </div>
        <button className="cp-b" onClick={() => setOpen(!open)} style={{ display: "none", background: "none", border: "none", color: C.ink, fontSize: 21, cursor: "pointer" }}>{open ? "✕" : "☰"}</button>
      </div>
      {open && <div className="cp-m" style={{ display: "none", flexDirection: "column", gap: 16, padding: "20px 30px", background: "rgba(10,10,11,0.97)", borderBottom: `1px solid ${C.line}` }}>{links.map(([l, id]) => <button key={id} onClick={() => go(id)} style={{ background: "none", border: "none", color: C.ink, fontFamily: C.body, fontSize: 16, textAlign: "left", cursor: "pointer" }}>{l}</button>)}</div>}
    </nav>
  );
}

function Hero() {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "130px 30px 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "8%", left: "-10%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${C.brand}14, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "2%", right: "-10%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${C.creator}12, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1140, margin: "0 auto", width: "100%", position: "relative" }}>
        <Reveal delay={0.05}><span style={{ fontFamily: C.body, fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", color: C.faint }}>Influencer marketing &middot; AI &amp; productivity tools</span></Reveal>
        <Reveal delay={0.16}><h1 style={{ fontFamily: C.disp, fontWeight: 500, fontSize: "clamp(2.7rem,7vw,5.6rem)", lineHeight: 1.02, letterSpacing: "-0.03em", color: C.ink, margin: "28px 0 0" }}>We pair <span style={{ color: C.brand }}>AI brands</span><br />with the <span style={{ color: C.creator, fontStyle: "italic" }}>creators</span> their<br />buyers already watch.</h1></Reveal>
        <Reveal delay={0.3}><p style={{ fontFamily: C.body, fontSize: "clamp(1rem,1.7vw,1.18rem)", lineHeight: 1.65, color: C.mut, margin: "30px 0 0", maxWidth: "50ch" }}>A Sweden-based agency working only inside AI and productivity tools on YouTube. We find the match, handle the deal, and keep the integration honest on both sides.</p></Reveal>
        <Reveal delay={0.42}><div style={{ display: "flex", gap: 13, marginTop: 42, flexWrap: "wrap" }}>
          <button onClick={() => go("contact")} style={{ fontFamily: C.body, background: C.ink, color: C.bg, border: "none", padding: "14px 30px", fontSize: 15, fontWeight: 500, cursor: "pointer", borderRadius: 1, transition: "opacity .25s" }} onMouseEnter={(e) => (e.target.style.opacity = ".85")} onMouseLeave={(e) => (e.target.style.opacity = "1")}>Start a campaign</button>
          <button onClick={() => go("pairings")} style={{ fontFamily: C.body, background: "transparent", color: C.ink, border: `1px solid ${C.line}`, padding: "14px 30px", fontSize: 15, cursor: "pointer", borderRadius: 1, transition: "border-color .25s" }} onMouseEnter={(e) => (e.target.style.borderColor = C.mut)} onMouseLeave={(e) => (e.target.style.borderColor = C.line)}>See how we match</button>
        </div></Reveal>
      </div>
    </section>
  );
}

const PAIRS = [
  { brandType: "Cold-email / sales tool", brandNote: "wants buyers, not impressions", creatorType: "Sales & business creator", creatorNote: "an audience that sells for a living", scale: "~375K subscribers" },
  { brandType: "AI video tool", brandNote: "needs the output shown, not described", creatorType: "Cinematic AI filmmaker", creatorNote: "viewers who make films with AI", scale: "~275K subscribers" },
  { brandType: "Automation / AI platform", brandNote: "wants high-intent builders", creatorType: "AI tools & builder channel", creatorNote: "views far above subscriber count", scale: "100K–240K views / video" },
  { brandType: "AI notetaking / productivity", brandNote: "lives in back-to-back meetings", creatorType: "Solopreneur & operator creator", creatorNote: "an audience running lean businesses", scale: "high-intent niche" },
];

function PairRow({ p, i }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={i * 0.07}>
      <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} className="cp-pair" style={{ display: "grid", gridTemplateColumns: "1fr 64px 1fr", alignItems: "stretch", borderTop: `1px solid ${C.lineSoft}`, transition: "background .3s", background: h ? C.panel : "transparent" }}>
        <div style={{ padding: "30px clamp(16px,3vw,34px)", borderLeft: `2px solid ${h ? C.brand : "transparent"}`, transition: "border-color .3s" }}>
          <span style={{ fontFamily: C.body, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.brand }}>Brand</span>
          <h3 style={{ fontFamily: C.disp, fontWeight: 500, fontSize: "clamp(1.05rem,2vw,1.4rem)", color: C.ink, margin: "9px 0 6px", letterSpacing: "-0.01em" }}>{p.brandType}</h3>
          <p style={{ fontFamily: C.body, fontSize: 14, color: C.mut, margin: 0 }}>{p.brandNote}</p>
        </div>
        <div className="cp-conn" style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, right: "50%", height: 1, background: h ? C.brand : C.line, transition: "background .3s" }} />
          <div style={{ position: "absolute", left: "50%", right: 0, height: 1, background: h ? C.creator : C.line, transition: "background .3s" }} />
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: C.bg, border: `1px solid ${h ? C.ink : C.line}`, position: "relative", zIndex: 1, transition: "all .3s", transform: h ? "scale(1.5)" : "scale(1)" }} />
        </div>
        <div style={{ padding: "30px clamp(16px,3vw,34px)", textAlign: "right", borderRight: `2px solid ${h ? C.creator : "transparent"}`, transition: "border-color .3s" }}>
          <span style={{ fontFamily: C.body, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.creator }}>Creator</span>
          <h3 style={{ fontFamily: C.disp, fontWeight: 500, fontSize: "clamp(1.05rem,2vw,1.4rem)", color: C.ink, margin: "9px 0 6px", letterSpacing: "-0.01em" }}>{p.creatorType}</h3>
          <p style={{ fontFamily: C.body, fontSize: 14, color: C.mut, margin: "0 0 4px" }}>{p.creatorNote}</p>
          <p style={{ fontFamily: C.body, fontSize: 12.5, color: C.faint, margin: 0 }}>{p.scale}</p>
        </div>
      </div>
    </Reveal>
  );
}

function Pairings() {
  return (
    <section id="pairings" style={{ padding: "110px 30px", borderTop: `1px solid ${C.lineSoft}` }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <Reveal>
          <span style={{ fontFamily: C.body, fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", color: C.faint }}>The kinds of pairings we make</span>
          <h2 style={{ fontFamily: C.disp, fontWeight: 500, fontSize: "clamp(1.9rem,4vw,2.9rem)", letterSpacing: "-0.02em", color: C.ink, margin: "18px 0 8px", maxWidth: "22ch" }}>Every match starts from one question: whose audience already wants this?</h2>
          <p style={{ fontFamily: C.body, fontSize: 15, color: C.mut, margin: "0 0 48px", maxWidth: "54ch", lineHeight: 1.6 }}>These illustrate the kinds of matches we work on, not named campaigns. The logic is always the same. Pair a brand with a creator whose viewers are the exact people who buy the tool.</p>
        </Reveal>
        <div style={{ borderBottom: `1px solid ${C.lineSoft}` }}>{PAIRS.map((p, i) => <PairRow key={i} p={p} i={i} />)}</div>
      </div>
    </section>
  );
}

function Approach() {
  const rows = [
    ["Fit before reach", "A smaller channel with an engaged audience beats a big one people stopped watching. We read how an audience behaves, not just how many followed once."],
    ["One niche, deeply", "We only work in AI and productivity tools. That focus is why we already know which creators a given brand's buyers actually watch."],
    ["The whole deal, handled", "From first outreach to rate, brief and delivery. One point of contact for the brand, vetted opportunities for the creator, and no chasing on either side."],
  ];
  return (
    <section id="approach" style={{ padding: "110px 30px", borderTop: `1px solid ${C.lineSoft}` }}>
      <div className="cp-appr" style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: "clamp(28px,6vw,80px)" }}>
        <Reveal><h2 style={{ fontFamily: C.disp, fontWeight: 500, fontSize: "clamp(1.9rem,4vw,2.7rem)", letterSpacing: "-0.02em", color: C.ink, margin: 0, position: "sticky", top: 120 }}>How we<br /><span style={{ fontStyle: "italic", color: C.mut }}>actually work.</span></h2></Reveal>
        <div>{rows.map(([t, d], i) => <Reveal key={t} delay={i * 0.08}><div style={{ padding: "30px 0", borderTop: `1px solid ${C.lineSoft}` }}><h3 style={{ fontFamily: C.disp, fontWeight: 500, fontSize: 22, color: C.ink, margin: "0 0 10px", letterSpacing: "-0.01em" }}>{t}</h3><p style={{ fontFamily: C.body, fontSize: 15.5, lineHeight: 1.7, color: C.mut, margin: 0, maxWidth: "56ch" }}>{d}</p></div></Reveal>)}</div>
      </div>
    </section>
  );
}

const WEB3FORMS_KEY = "1747e55a-ce41-46de-bf00-8dfadc10df01";

function Contact() {
  const [d, setD] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const send = async () => {
    if (!d.name || !d.email || !d.message || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New CastPair inquiry from ${d.name}`,
          from_name: "CastPair Website",
          name: d.name,
          email: d.email,
          message: d.message,
        }),
      });
      const json = await res.json();
      if (json.success) { setStatus("done"); setD({ name: "", email: "", message: "" }); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };
  const inp = { width: "100%", padding: "14px 0", background: "transparent", border: "none", borderBottom: `1px solid ${C.line}`, color: C.ink, fontSize: 15.5, fontFamily: C.body, outline: "none", boxSizing: "border-box", transition: "border-color .25s" };
  const fx = (e) => (e.target.style.borderColor = C.ink); const bl = (e) => (e.target.style.borderColor = C.line);
  return (
    <section id="contact" style={{ padding: "110px 30px", borderTop: `1px solid ${C.lineSoft}` }}>
      <div className="cp-c" style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,7vw,90px)" }}>
        <Reveal><div>
          <h2 style={{ fontFamily: C.disp, fontWeight: 500, fontSize: "clamp(2rem,4.4vw,3.2rem)", letterSpacing: "-0.02em", color: C.ink, margin: 0, lineHeight: 1.08 }}>Tell us what<br />you&rsquo;re <span style={{ fontStyle: "italic", color: C.mut }}>building.</span></h2>
          <p style={{ fontFamily: C.body, fontSize: 15.5, lineHeight: 1.7, color: C.mut, margin: "24px 0 0", maxWidth: "38ch" }}>A brand after the right creator, or a creator after better deals. Either way, send a note and I&rsquo;ll reply.</p>
          <a href="mailto:shine@castpair.com" style={{ fontFamily: C.body, display: "inline-block", marginTop: 30, color: C.ink, fontSize: 15, textDecoration: "none", borderBottom: `1px solid ${C.line}`, paddingBottom: 3 }}>shine@castpair.com</a>
        </div></Reveal>
        <Reveal delay={0.15}>
          {status === "done" ? (
            <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 28 }}>
              <span style={{ fontFamily: C.body, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: C.brand }}>Message sent</span>
              <p style={{ fontFamily: C.disp, fontWeight: 500, fontSize: "clamp(1.4rem,2.6vw,1.9rem)", color: C.ink, margin: "14px 0 0", letterSpacing: "-0.01em" }}>Thanks. I&rsquo;ll get back to you shortly.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <input placeholder="Name" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} style={inp} onFocus={fx} onBlur={bl} />
              <input placeholder="Email" type="email" value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} style={inp} onFocus={fx} onBlur={bl} />
              <textarea placeholder="What are you working on?" rows={3} value={d.message} onChange={(e) => setD({ ...d, message: e.target.value })} style={{ ...inp, resize: "vertical" }} onFocus={fx} onBlur={bl} />
              <button onClick={send} disabled={status === "sending"} style={{ fontFamily: C.body, alignSelf: "flex-start", marginTop: 6, background: C.ink, color: C.bg, border: "none", padding: "13px 30px", fontSize: 15, fontWeight: 500, cursor: status === "sending" ? "default" : "pointer", borderRadius: 1, opacity: status === "sending" ? 0.6 : 1, transition: "opacity .25s" }} onMouseEnter={(e) => { if (status !== "sending") e.target.style.opacity = ".85"; }} onMouseLeave={(e) => { if (status !== "sending") e.target.style.opacity = "1"; }}>{status === "sending" ? "Sending..." : "Send"}</button>
              {status === "error" && <span style={{ fontFamily: C.body, fontSize: 13.5, color: C.creator }}>Something went wrong. Email shine@castpair.com directly.</span>}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "32px 30px", borderTop: `1px solid ${C.lineSoft}` }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center" }}><span style={{ fontFamily: C.disp, fontSize: 15, color: C.brand }}>Cast</span><span style={{ fontFamily: C.disp, fontSize: 15, color: C.creator }}>Pair</span></div>
        <span style={{ fontFamily: C.body, fontSize: 13, color: C.faint }}>© {new Date().getFullYear()} · Sweden</span>
      </div>
    </footer>
  );
}

export default function CastPair() {
  useFonts();
  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh", fontFamily: C.body, WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        @media(max-width:780px){
          .cp-d{display:none !important}.cp-b{display:block !important}.cp-m{display:flex !important}
          .cp-appr{grid-template-columns:1fr !important}.cp-c{grid-template-columns:1fr !important}
          .cp-pair{grid-template-columns:1fr !important}
          .cp-pair > div:nth-child(3){text-align:left !important;border-right:none !important}
          .cp-conn{display:none !important}
        }
        ::selection{background:${C.ink};color:${C.bg}}
        html{scroll-behavior:smooth}body{margin:0}
      `}</style>
      <Nav /><Hero /><Pairings /><Approach /><Contact /><Footer />
    </div>
  );
}
