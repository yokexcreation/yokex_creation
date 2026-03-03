import { useState, useRef, useEffect } from "react";

// ── Google Fonts ──────────────────────────────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');

    :root {
      --gold: #c9a84c;
      --gold-light: #e8cc7a;
      --gold-dim: #7a6230;
      --black: #080808;
      --black-2: #111010;
      --black-3: #1a1917;
      --black-4: #242220;
      --white: #f5f0e8;
      --white-dim: #9e9890;
      --border: rgba(201,168,76,0.2);
      --border-bright: rgba(201,168,76,0.6);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body { background: var(--black); }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-16px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(16px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .fade-up { animation: fadeUp 0.6s ease forwards; }
    .fade-up-2 { animation: fadeUp 0.6s 0.1s ease both; }
    .fade-up-3 { animation: fadeUp 0.6s 0.2s ease both; }
    .fade-up-4 { animation: fadeUp 0.6s 0.3s ease both; }

    .gold-text {
      background: linear-gradient(90deg, var(--gold-dim), var(--gold-light), var(--gold), var(--gold-dim));
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    .photo-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
    .photo-card:hover { transform: scale(1.03); box-shadow: 0 20px 60px rgba(201,168,76,0.15); }
    .photo-card:hover .photo-overlay { opacity: 1 !important; }

    .nav-btn { transition: all 0.2s ease; }
    .nav-btn:hover { color: var(--gold-light) !important; }

    .event-card { transition: all 0.3s ease; }
    .event-card:hover { transform: translateY(-4px); border-color: var(--gold) !important; box-shadow: 0 16px 48px rgba(201,168,76,0.12); }

    .btn-gold {
      background: linear-gradient(135deg, var(--gold-dim), var(--gold), var(--gold-light));
      color: var(--black);
      border: none;
      cursor: pointer;
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      transition: all 0.25s ease;
    }
    .btn-gold:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(201,168,76,0.3); }

    .btn-outline {
      background: transparent;
      color: var(--gold);
      border: 1px solid var(--border-bright);
      cursor: pointer;
      font-family: 'Montserrat', sans-serif;
      font-weight: 500;
      letter-spacing: 1px;
      text-transform: uppercase;
      transition: all 0.25s ease;
    }
    .btn-outline:hover { background: rgba(201,168,76,0.08); border-color: var(--gold); }

    .tab-active {
      background: linear-gradient(135deg, var(--gold-dim), var(--gold));
      color: var(--black) !important;
    }

    input[type="file"] { display: none; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--black-2); }
    ::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 2px; }
  `}</style>
);

// ── Sample Data ───────────────────────────────────────────────────────────────
const INIT_EVENTS = [
  {
    id: "YKX001",
    name: "Priya & Arjun Wedding",
    date: "2026-02-14",
    venue: "The Grand Palace, Mumbai",
    photos: [
      { id: 1, url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600", thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?w=300", label: "Ceremony" },
      { id: 2, url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600", thumb: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300", label: "Reception" },
      { id: 3, url: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600", thumb: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=300", label: "Couple Portrait" },
      { id: 4, url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600", thumb: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=300", label: "Family" },
      { id: 5, url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600", thumb: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=300", label: "First Dance" },
      { id: 6, url: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600", thumb: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=300", label: "Decor" },
    ]
  },
  {
    id: "YKX002",
    name: "Sara & James Wedding",
    date: "2026-01-20",
    venue: "Seaside Resort, Goa",
    photos: [
      { id: 7, url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600", thumb: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=300", label: "Vows" },
      { id: 8, url: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=600", thumb: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=300", label: "Rings" },
      { id: 9, url: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=600", thumb: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=300", label: "Portrait" },
    ]
  }
];

// ── QR Code Component ─────────────────────────────────────────────────────────
const QRCode = ({ eventId, size = 160 }) => {
  const url = `https://yokexcreation.com/gallery/${eventId}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&color=c9a84c&bgcolor=080808&qzone=2`;
  return <img src={qrSrc} alt="QR Code" style={{ width: size, height: size, display: "block" }} />;
};

// ── Decorative Divider ────────────────────────────────────────────────────────
const Divider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "32px 0 24px" }}>
    <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, var(--border-bright))" }} />
    {label && <span style={{ fontFamily: "Montserrat", fontSize: 10, letterSpacing: 4, color: "var(--gold)", textTransform: "uppercase" }}>{label}</span>}
    <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, var(--border-bright))" }} />
  </div>
);

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg }) => (
  <div style={{
    position: "fixed", bottom: 32, right: 32, zIndex: 9999,
    background: "linear-gradient(135deg, var(--black-3), var(--black-4))",
    border: "1px solid var(--border-bright)",
    padding: "14px 24px", borderRadius: 8,
    fontFamily: "Montserrat", fontSize: 13, color: "var(--gold-light)",
    letterSpacing: 0.5,
    boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.1)",
    animation: "toastIn 0.3s ease forwards"
  }}>{msg}</div>
);

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("admin");
  const [events, setEvents] = useState(INIT_EVENTS);
  const [activeEventId, setActiveEventId] = useState(null);
  const [qrModal, setQrModal] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [newEventModal, setNewEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", date: "", venue: "" });
  const [toast, setToast] = useState(null);
  const [guestEventId, setGuestEventId] = useState(INIT_EVENTS[0].id);
  const fileRef = useRef();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const activeEvent = events.find(e => e.id === activeEventId);
  const guestEvent = events.find(e => e.id === guestEventId);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !activeEventId) return;
    const newPhotos = files.map((f, i) => ({
      id: Date.now() + i,
      url: URL.createObjectURL(f),
      thumb: URL.createObjectURL(f),
      label: f.name.replace(/\.[^/.]+$/, "")
    }));
    setEvents(ev => ev.map(e => e.id === activeEventId ? { ...e, photos: [...e.photos, ...newPhotos] } : e));
    showToast(`✦ ${files.length} photo${files.length > 1 ? "s" : ""} uploaded successfully`);
    e.target.value = "";
  };

  const handleCreateEvent = () => {
    if (!newEvent.name || !newEvent.date) return;
    const id = "YKX" + String(events.length + 1).padStart(3, "0");
    setEvents(ev => [...ev, { ...newEvent, id, photos: [] }]);
    setNewEvent({ name: "", date: "", venue: "" });
    setNewEventModal(false);
    setActiveEventId(id);
    showToast("✦ New event created");
  };

  const totalPhotos = events.reduce((a, e) => a + e.photos.length, 0);

  return (
    <>
      <FontLink />
      <div style={{ minHeight: "100vh", background: "var(--black)", fontFamily: "Montserrat, sans-serif" }}>

        {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
        <header style={{
          position: "sticky", top: 0, zIndex: 200,
          background: "rgba(8,8,8,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
          padding: "0 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 72,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              border: "1px solid var(--gold)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, color: "var(--gold)"
            }}>✦</div>
            <div>
              <div style={{ fontFamily: "Cormorant Garamond", fontSize: 20, fontWeight: 600, color: "var(--white)", letterSpacing: 2 }}>
                YOKEX CREATION
              </div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: "var(--white-dim)", textTransform: "uppercase", marginTop: 1 }}>
                Photography Studio
              </div>
            </div>
          </div>

          {/* Tab Switcher */}
          <div style={{
            display: "flex", gap: 4,
            background: "var(--black-3)", borderRadius: 6,
            padding: 4, border: "1px solid var(--border)"
          }}>
            {[["admin", "Studio Dashboard"], ["guest", "Guest Gallery"]].map(([v, label]) => (
              <button key={v} onClick={() => setView(v)}
                className={`nav-btn ${view === v ? "tab-active" : ""}`}
                style={{
                  padding: "8px 20px", borderRadius: 4, border: "none",
                  fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase",
                  cursor: "pointer", color: view === v ? "var(--black)" : "var(--white-dim)",
                  fontFamily: "Montserrat", fontWeight: 600,
                  background: view === v ? undefined : "transparent",
                  transition: "all 0.2s"
                }}>{label}</button>
            ))}
          </div>
        </header>

        {/* ══ ADMIN VIEW ══════════════════════════════════════════════════════ */}
        {view === "admin" && (
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px" }}>

            {/* Stats Row */}
            <div className="fade-up" style={{ display: "flex", gap: 16, marginBottom: 48 }}>
              {[
                { icon: "◈", label: "Total Events", value: events.length },
                { icon: "◉", label: "Photos Archived", value: totalPhotos },
                { icon: "◎", label: "QR Codes Active", value: events.length },
                { icon: "◐", label: "Studio Since", value: "2024" },
              ].map(s => (
                <div key={s.label} style={{
                  flex: 1, background: "var(--black-2)",
                  border: "1px solid var(--border)",
                  borderRadius: 12, padding: "24px 28px",
                  position: "relative", overflow: "hidden"
                }}>
                  <div style={{ position: "absolute", top: 16, right: 20, fontSize: 20, color: "var(--gold-dim)", opacity: 0.5 }}>{s.icon}</div>
                  <div style={{ fontFamily: "Cormorant Garamond", fontSize: 40, color: "var(--gold)", fontWeight: 300, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: "var(--white-dim)", textTransform: "uppercase", marginTop: 8 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Events Header */}
            <div className="fade-up-2" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontFamily: "Cormorant Garamond", fontSize: 28, color: "var(--white)", fontWeight: 300, letterSpacing: 1 }}>
                Your Events
              </div>
              <button className="btn-gold" onClick={() => setNewEventModal(true)}
                style={{ padding: "10px 24px", borderRadius: 6, fontSize: 11 }}>
                + New Event
              </button>
            </div>

            {/* Events Grid */}
            <div className="fade-up-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16, marginBottom: 48 }}>
              {events.map(event => (
                <div key={event.id} className="event-card"
                  style={{
                    background: activeEventId === event.id ? "var(--black-3)" : "var(--black-2)",
                    border: `1px solid ${activeEventId === event.id ? "var(--gold)" : "var(--border)"}`,
                    borderRadius: 12, padding: 24, cursor: "pointer",
                  }}
                  onClick={() => setActiveEventId(activeEventId === event.id ? null : event.id)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontFamily: "Cormorant Garamond", fontSize: 20, color: "var(--white)", marginBottom: 4 }}>{event.name}</div>
                      <div style={{ fontSize: 11, color: "var(--white-dim)", letterSpacing: 1 }}>📅 {event.date}</div>
                      {event.venue && <div style={{ fontSize: 11, color: "var(--white-dim)", marginTop: 2 }}>📍 {event.venue}</div>}
                    </div>
                    <div style={{
                      background: "rgba(201,168,76,0.1)", border: "1px solid var(--border)",
                      borderRadius: 20, padding: "4px 12px",
                      fontSize: 11, color: "var(--gold)", fontWeight: 600, whiteSpace: "nowrap"
                    }}>{event.photos.length} photos</div>
                  </div>

                  {/* Thumbnail Strip */}
                  {event.photos.length > 0 && (
                    <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                      {event.photos.slice(0, 4).map((p, i) => (
                        <div key={p.id} style={{
                          flex: 1, aspectRatio: "1", borderRadius: 4, overflow: "hidden",
                          opacity: i === 3 && event.photos.length > 4 ? 0.5 : 1,
                          position: "relative"
                        }}>
                          <img src={p.thumb} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          {i === 3 && event.photos.length > 4 && (
                            <div style={{
                              position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 12, color: "var(--gold)", fontWeight: 700
                            }}>+{event.photos.length - 4}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-outline" onClick={e => { e.stopPropagation(); setQrModal(event); }}
                      style={{ flex: 1, padding: "8px 0", borderRadius: 6, fontSize: 10 }}>🔲 QR Code</button>
                    <button className="btn-gold" onClick={e => { e.stopPropagation(); setActiveEventId(event.id); fileRef.current?.click(); }}
                      style={{ flex: 1, padding: "8px 0", borderRadius: 6, fontSize: 10 }}>⬆ Upload</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Event Gallery */}
            {activeEvent && (
              <div className="fade-up-3">
                <Divider label={activeEvent.name} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 13, color: "var(--white-dim)", letterSpacing: 1 }}>{activeEvent.photos.length} photographs</div>
                  <button className="btn-gold" onClick={() => fileRef.current?.click()}
                    style={{ padding: "10px 24px", borderRadius: 6, fontSize: 11 }}>+ Add Photos</button>
                </div>
                <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleUpload} />

                {activeEvent.photos.length === 0 ? (
                  <div style={{
                    border: "2px dashed var(--border)", borderRadius: 12,
                    padding: 64, textAlign: "center"
                  }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
                    <div style={{ fontFamily: "Cormorant Garamond", fontSize: 22, color: "var(--white-dim)" }}>No photos yet</div>
                    <div style={{ fontSize: 12, color: "var(--white-dim)", marginTop: 8 }}>Upload your first batch to get started</div>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                    {activeEvent.photos.map(photo => (
                      <div key={photo.id} className="photo-card"
                        style={{ borderRadius: 8, overflow: "hidden", position: "relative", cursor: "pointer", background: "var(--black-3)" }}
                        onClick={() => setLightbox({ photo, event: activeEvent })}>
                        <img src={photo.thumb} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                        <div className="photo-overlay" style={{
                          position: "absolute", inset: 0, opacity: 0, transition: "opacity 0.25s",
                          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)",
                          display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "12px 14px"
                        }}>
                          <span style={{ fontSize: 12, color: "var(--white)", letterSpacing: 0.5 }}>{photo.label}</span>
                          <span style={{ fontSize: 11, color: "var(--gold)" }}>View ✦</span>
                        </div>
                   
