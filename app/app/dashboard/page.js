import UpgradeButton from "../components/UpgradeButton";
import { auth } from "../../lib/auth/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Your workspace — FRAMEWORK",
  description: "Turn your next screenplay scene into a practical plan for set.",
};

const dashboardStyles = `
  .workspace {
    min-height: 100vh; background: #0c1011; color: #eeeee5;
    font-family: Arial, Helvetica, sans-serif;
    --lime: #daf578; --muted: #a6b2ac; --line: #2c3430;
  }
  .workspace a:focus-visible, .workspace button:focus-visible {
    outline: 3px solid var(--lime); outline-offset: 5px;
  }
  .workspace .shell { max-width: 1280px; margin: 0 auto; padding: 0 48px; }
  .workspace .topbar { border-bottom: 1px solid var(--line); }
  .workspace .topbar-inner { min-height: 84px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
  .workspace .brand { font-size: 23px; font-weight: 800; letter-spacing: -1.1px; }
  .workspace .brand span { color: var(--lime); }
  .workspace .account-nav { display: flex; align-items: center; gap: 24px; font-size: 13px; }
  .workspace .quiet-link { color: var(--muted); transition: color 160ms; }
  .workspace .quiet-link:hover { color: #fff; }
  .workspace .avatar { width: 34px; height: 34px; border: 1px solid #4c5a46; border-radius: 50%; display: grid; place-items: center; background: #222c22; color: var(--lime); font-size: 12px; font-weight: 700; flex: 0 0 auto; }
  .workspace .navline { display: flex; align-items: center; justify-content: space-between; min-height: 56px; border-bottom: 1px solid var(--line); }
  .workspace .tabs { display: flex; gap: 28px; font-size: 13px; align-self: stretch; align-items: stretch; }
  .workspace .tabs a { display: flex; align-items: center; }
  .workspace .active-tab { color: var(--lime); border-bottom: 2px solid var(--lime); font-weight: 700; }
  .workspace .eyebrow { color: var(--muted); font: 10px/1.5 monospace; letter-spacing: 1.7px; text-transform: uppercase; }
  .workspace .ready { display: flex; align-items: center; gap: 8px; color: var(--muted); font-size: 11px; }
  .workspace .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--lime); box-shadow: 0 0 12px #daf57830; }
  .workspace .welcome { padding: 48px 0 32px; }
  .workspace .welcome h1 { font-size: clamp(34px, 4vw, 52px); font-weight: 650; letter-spacing: -2px; line-height: 1.12; margin: 12px 0; }
  .workspace .welcome h1 em { color: var(--lime); font-family: Georgia, serif; font-weight: 400; }
  .workspace .welcome p { font-size: 15px; color: var(--muted); line-height: 1.7; }
  .workspace .main-grid { display: grid; grid-template-columns: minmax(0, 1.95fr) minmax(280px, 1fr); gap: 24px; }
  .workspace .analyzer-card { position: relative; overflow: hidden; border: 1px solid #465444; border-radius: 12px; background: linear-gradient(120deg, #202d23, #141d18 76%); padding: 32px; }
  .workspace .card-top { display: flex; justify-content: space-between; align-items: center; gap: 16px; position: relative; z-index: 1; }
  .workspace .tool-icon { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 9px; border: 1px solid #54634a; background: #ffffff06; color: var(--lime); }
  .workspace .tool-label { border: 1px solid #4a5840; border-radius: 30px; padding: 6px 9px; color: #d8e4ce; font: 9px monospace; letter-spacing: 1px; }
  .workspace .analyzer-card h2 { font-size: 34px; line-height: 1.18; font-weight: 650; letter-spacing: -1px; margin: 25px 0 14px; position: relative; z-index: 1; max-width: 400px; }
  .workspace .analyzer-card .description { max-width: 340px; color: #b0bdb3; font-size: 14px; line-height: 1.7; position: relative; z-index: 1; }
  .workspace .primary-action { display: inline-flex; justify-content: center; align-items: center; gap: 26px; padding: 15px 20px; border-radius: 5px; background: var(--lime); color: #152014; font-size: 14px; font-weight: 700; margin-top: 26px; transition: background 160ms, transform 160ms; position: relative; z-index: 1; }
  .workspace .primary-action:hover { background: #e7ffa1; transform: translateY(-2px); }
  .workspace .tool-features { display: flex; flex-wrap: wrap; gap: 10px 20px; border-top: 1px solid #405040; padding-top: 22px; margin-top: 30px; color: #c0ccbf; font-size: 11px; position: relative; z-index: 1; }
  .workspace .tool-features span::before { content: '↗'; margin-right: 7px; color: var(--lime); }
  .workspace .frame-art { position: absolute; right: -35px; top: 88px; width: 240px; height: 190px; opacity: 0.25; transform: rotate(-12deg); pointer-events: none; }
  .workspace .side-stack { display: flex; flex-direction: column; gap: 18px; min-width: 0; }
  .workspace .account-card, .workspace .plan-card { background: #121819; border: 1px solid var(--line); border-radius: 12px; padding: 24px; }
  .workspace .account-details { display: flex; gap: 12px; align-items: center; margin-top: 15px; min-width: 0; }
  .workspace .account-details .avatar { width: 40px; height: 40px; }
  .workspace .account-name { font-size: 14px; font-weight: 600; margin-bottom: 5px; overflow-wrap: anywhere; }
  .workspace .account-email { font-size: 12px; color: var(--muted); overflow-wrap: anywhere; }
  .workspace .plan-card { flex: 1; }
  .workspace .plan-heading { display: flex; align-items: center; justify-content: space-between; }
  .workspace .plan-heading h2 { font-weight: 700; font-size: 15px; letter-spacing: -0.2px; }
  .workspace .plan-pill { padding: 5px 7px; border: 1px solid #3d4936; border-radius: 4px; color: var(--lime); font: 9px monospace; letter-spacing: 0.8px; }
  .workspace .price { font-size: 40px; font-weight: 600; letter-spacing: -2px; margin: 19px 0 10px; line-height: 1; }
  .workspace .price span { margin-left: 8px; color: var(--muted); font-size: 11px; font-weight: 400; letter-spacing: 0; }
  .workspace .plan-copy { color: var(--muted); font-size: 12px; line-height: 1.7; }
  .workspace .checkout-button > div { margin-top: 20px !important; }
  .workspace .checkout-button button { width: 100%; background: #25332a !important; border: 1px solid #485d45 !important; padding: 13px 12px !important; color: #dcebd6 !important; font-size: 12px !important; border-radius: 5px !important; font-weight: 600; transition: background 160ms; }
  .workspace .checkout-button button:hover { background: #344736 !important; }
  .workspace .checkout-button button:disabled { opacity: 0.65; }
  .workspace .checkout-button p { font-size: 12px; margin-top: 12px; }
  .workspace .payment-note { font-size: 10px; color: #a4afa7; margin-top: 11px; text-align: center; }
  .workspace .process { padding: 36px 0 40px; }
  .workspace .process-heading { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px; }
  .workspace .process-heading h2 { font-size: 14px; font-weight: 600; }
  .workspace .process-grid { display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
  .workspace .step { padding: 22px; display: flex; gap: 15px; background: #111617; }
  .workspace .step + .step { border-left: 1px solid var(--line); }
  .workspace .step-number { font: 12px monospace; color: #8c9d80; padding-top: 2px; }
  .workspace .step h3 { font-size: 13px; font-weight: 600; margin-bottom: 7px; }
  .workspace .step p { font-size: 11px; color: var(--muted); line-height: 1.65; }
  .workspace footer { border-top: 1px solid var(--line); padding: 20px 0; display: flex; gap: 20px; justify-content: space-between; color: #93a198; font: 9px monospace; letter-spacing: 1px; }
  @media (max-width: 960px) {
    .workspace .shell { padding: 0 28px; }
    .workspace .main-grid { grid-template-columns: minmax(0, 1.4fr) minmax(260px, 1fr); }
    .workspace .frame-art { opacity: 0.12; }
    .workspace .analyzer-card { padding: 26px; }
    .workspace .process-grid { grid-template-columns: 1fr; }
    .workspace .step + .step { border-left: 0; border-top: 1px solid var(--line); }
  }
  @media (max-width: 680px) {
    .workspace .shell { padding: 0 20px; }
    .workspace .topbar-inner { min-height: 72px; gap: 15px; }
    .workspace .brand { font-size: 20px; }
    .workspace .account-nav { gap: 16px; }
    .workspace .home-link, .workspace .account-nav .avatar, .workspace .ready { display: none; }
    .workspace .welcome { padding-top: 32px; }
    .workspace .welcome h1 { letter-spacing: -1.4px; }
    .workspace .main-grid { grid-template-columns: 1fr; gap: 18px; }
    .workspace .analyzer-card h2 { font-size: 30px; }
    .workspace .analyzer-card { padding: 25px; }
    .workspace .primary-action { width: 100%; gap: 16px; }
    .workspace .tool-features { gap: 12px; }
    .workspace .process { padding-top: 30px; }
    .workspace .process-heading .eyebrow { display: none; }
    .workspace footer { flex-direction: column; gap: 10px; line-height: 1.5; }
  }
  @media (prefers-reduced-motion: reduce) {
    .workspace a, .workspace button { transition: none !important; }
    .workspace .primary-action:hover { transform: none; }
  }
`;

export default async function DashboardPage() {
  const { data } = await auth.getSession();
  if (!data?.user) redirect("/auth/sign-in");

  const name = data.user.name || data.user.email;
  const initials = name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();

  return (
    <div className="workspace">
      <style>{dashboardStyles}</style>
      <header className="topbar">
        <div className="shell topbar-inner">
          <Link className="brand" href="/" aria-label="FRAMEWORK home">FRAMEWORK<span>.</span></Link>
          <nav className="account-nav" aria-label="Account navigation">
            <Link className="quiet-link home-link" href="/">Back to home</Link>
            <span className="avatar" aria-hidden="true">{initials}</span>
            <Link className="quiet-link" href="/auth/sign-out">Sign out ↗</Link>
          </nav>
        </div>
      </header>
      <div className="shell">
        <nav className="navline" aria-label="Workspace navigation">
          <div className="tabs">
            <Link href="/dashboard" className="active-tab" aria-current="page">Workspace</Link>
            <Link href="/analyze" className="quiet-link">Screenplay analyzer</Link>
          </div>
          <span className="ready"><span className="dot" aria-hidden="true"/>Ready for your next scene</span>
        </nav>
        <main>
          <section className="welcome" aria-labelledby="welcome-title">
            <p className="eyebrow">YOUR FILMMAKING WORKSPACE</p>
            <h1 id="welcome-title">Let’s set the <em>scene.</em></h1>
            <p>Welcome back, {name}. Bring the story. We’ll help with the plan.</p>
          </section>
          <div className="main-grid">
            <section className="analyzer-card" aria-labelledby="analyzer-title">
              <div className="card-top">
                <span className="tool-icon" aria-hidden="true">
                  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h5"/></svg>
                </span>
                <span className="tool-label">AI SCREENPLAY ANALYZER</span>
              </div>
              <svg className="frame-art" viewBox="0 0 240 190" fill="none" aria-hidden="true">
                <rect x="30" y="20" width="180" height="145" rx="5" stroke="#daf578"/>
                <path d="M45 50V35h25M170 35h25v15M45 135v15h25M170 150h25v-15M120 65v60M90 95h60" stroke="#daf578" strokeWidth="2"/>
                <path d="M30 57h180M30 130h180M90 20v145M150 20v145" stroke="#daf578" strokeDasharray="3 5" opacity="0.4"/>
              </svg>
              <h2 id="analyzer-title">From script<br/>to shooting plan.</h2>
              <p className="description">Break down your scene, find the details that matter, and explore a practical shot list for your crew.</p>
              <Link className="primary-action" href="/analyze">Analyze a screenplay <span aria-hidden="true">↗</span></Link>
              <div className="tool-features"><span>Scene breakdown</span><span>Shot suggestions</span><span>Production notes</span></div>
            </section>
            <aside className="side-stack" aria-label="Your account and Pro checkout">
              <section className="account-card" aria-labelledby="account-title">
                <h2 className="eyebrow" id="account-title">YOUR ACCOUNT</h2>
                <div className="account-details"><span className="avatar" aria-hidden="true">{initials}</span><div><p className="account-name">{name}</p><p className="account-email">{data.user.email}</p></div></div>
              </section>
              <section className="plan-card" aria-labelledby="plan-title">
                <div className="plan-heading"><h2 id="plan-title">FRAMEWORK Pro</h2><span className="plan-pill">TEST MODE</span></div>
                <p className="price">$5<span>one-time checkout</span></p>
                <p className="plan-copy">Less time on the logistics.<br/>More time behind the camera.</p>
                <div className="checkout-button"><UpgradeButton/></div>
                <p className="payment-note">Stripe test checkout · No real charges</p>
              </section>
            </aside>
          </div>
          <section className="process" aria-labelledby="process-title">
            <div className="process-heading"><h2 id="process-title">A little preparation. A better day on set.</h2><p className="eyebrow">PAGE → PLAN → ACTION</p></div>
            <div className="process-grid">
              <article className="step"><span className="step-number">01</span><div><h3>Bring your scene.</h3><p>Paste a scene from your screenplay into the analyzer.</p></div></article>
              <article className="step"><span className="step-number">02</span><div><h3>Find your direction.</h3><p>Review the breakdown, shot suggestions, and production notes.</p></div></article>
              <article className="step"><span className="step-number">03</span><div><h3>Make it your own.</h3><p>Adapt the plan to your vision, your crew, and your set.</p></div></article>
            </div>
          </section>
        </main>
        <footer><span>FRAMEWORK / MADE FOR THE MAKERS</span><span>CREATED BY LANDON CLARKEN · 2026</span></footer>
      </div>
    </div>
  );
}
