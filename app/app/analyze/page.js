"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import UpgradeButton from "../components/UpgradeButton";

const SAMPLE = `INT. COFFEE SHOP - NIGHT

Rain traces the window. MAYA sits across from JACK. An untouched coffee cup sits between them.

Maya places a brass key on the table.

MAYA
If we leave now, we can still make the last train.

Jack glances at the front door.

JACK
And if she comes back?

Maya pushes the key toward him. Jack takes it and stands.

EXT. COFFEE SHOP - CONTINUOUS

Maya opens a small umbrella. Jack pauses under the awning, looking back through the window.

MAYA
You can keep waiting. Or you can come with me.

Jack steps into the rain beside her. They walk toward the station.`;

const styles = `
.reader{min-height:100vh;background:#0c1011;color:#eeeee5;font-family:Arial,Helvetica,sans-serif;--lime:#daf578;--muted:#acb7af;--line:#303a33}
.reader .shell{max-width:1200px;margin:auto;padding:0 36px}.reader header{border-bottom:1px solid var(--line)}.reader .header-inner{min-height:80px;display:flex;align-items:center;justify-content:space-between;gap:20px}.reader .brand{font-size:23px;font-weight:800;letter-spacing:-1px}.reader .brand span{color:var(--lime)}.reader .back{font-size:13px;color:var(--muted)}.reader .intro{padding:42px 0 28px}.reader .eyebrow{font:10px/1.6 monospace;letter-spacing:1.5px;color:var(--muted);text-transform:uppercase}.reader h1{font-size:clamp(32px,4vw,46px);font-weight:650;letter-spacing:-1.6px;line-height:1.2;margin:12px 0}.reader h1 em{font-family:Georgia,serif;color:var(--lime);font-weight:400}.reader .intro>p:last-child{color:var(--muted);font-size:14px;line-height:1.7}.reader .layout{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:24px;align-items:start}.reader .input-card,.reader .plan-card,.reader .output-card{background:#131b17;border:1px solid var(--line);border-radius:12px;padding:26px;min-width:0}.reader button,.reader input{font:inherit}.reader button{cursor:pointer}.reader button:disabled{cursor:not-allowed;opacity:.55}.reader a:focus-visible,.reader button:focus-visible,.reader input:focus-visible,.reader textarea:focus-visible{outline:3px solid var(--lime);outline-offset:4px}.reader .input-header{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:24px;flex-wrap:wrap}.reader .switcher{display:flex;border:1px solid #3a463c;padding:4px;border-radius:7px;background:#0d1410;gap:4px}.reader .switcher button{padding:10px 17px;border:0;border-radius:4px;background:transparent;color:#afbeb2;font-size:12px}.reader .switcher button[aria-pressed=true]{background:#30402b;color:#e3f2d9}.reader .sample{background:none;border:0;color:var(--lime);font-size:12px;padding:8px 0}.reader .label-row{display:flex;justify-content:space-between;gap:14px;align-items:center;margin-bottom:12px}.reader label,.reader .label{font-size:13px;font-weight:600}.reader .counter{font:11px monospace;color:var(--muted);font-weight:400}.reader .counter.over{color:#ffc0a7}.reader textarea{display:block;width:100%;min-height:320px;resize:vertical;border:1px solid #3a493d;border-radius:7px;background:#0c1310;color:#e6ece3;padding:18px;font:13px/1.8 monospace;tab-size:4}.reader textarea::placeholder{color:#829086}.reader .help{font-size:11px;line-height:1.7;color:var(--muted);margin-top:12px}.reader .upload-area{border:1px dashed #52634e;background:#101911;border-radius:8px;min-height:280px;padding:35px 20px;text-align:center;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:15px}.reader .upload-icon{color:var(--lime);font-size:29px}.reader .upload-area h2{font-size:19px;font-weight:600;letter-spacing:-.4px}.reader .upload-area p{max-width:310px;color:var(--muted);font-size:12px;line-height:1.7}.reader input[type=file]{width:100%;max-width:340px;color:#c5d2c0;font-size:12px}.reader input[type=file]::file-selector-button{border:1px solid #536b48;background:#263722;color:#e5f5d8;padding:12px 14px;border-radius:5px;margin-right:10px;cursor:pointer}.reader .file-info{width:100%;overflow-wrap:anywhere;color:#e5efdc;font-size:12px;line-height:1.7}.reader .form-footer{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-top:24px;flex-wrap:wrap}.reader .primary{background:var(--lime);color:#172012;border:0;border-radius:5px;padding:15px 20px;font-size:13px;font-weight:700;display:inline-block}.reader .privacy{font-size:10px;line-height:1.6;color:var(--muted);max-width:245px}.reader .message{margin-top:18px;border:1px solid #79553a;background:#2b211a;color:#ffccaa;padding:13px 15px;border-radius:6px;font-size:12px;line-height:1.7}.reader .message a{color:#e7fa9e;text-decoration:underline}.reader .plan-card h2{font-size:20px;font-weight:650;margin:12px 0;letter-spacing:-.6px}.reader .plan-badge{display:inline-block;color:var(--lime);background:#263322;border:1px solid #536143;border-radius:4px;padding:5px 8px;font:9px monospace;letter-spacing:1px}.reader .plan-card ul{list-style:none;padding:0;margin:20px 0}.reader .plan-card li{font-size:12px;color:#bac6b8;line-height:1.8;margin:10px 0}.reader .plan-card li::before{content:'↗';color:var(--lime);margin-right:9px}.reader .plan-card .small{font-size:11px;color:var(--muted);line-height:1.8}.reader .plan-card .divider{border-top:1px solid var(--line);margin-top:22px;padding-top:22px}.reader .plan-card button{width:100%;padding:13px 10px!important;border:1px solid #4c6544!important;border-radius:5px!important;background:#293b24!important;color:#e0efd4!important;font-size:11px!important}.reader .plan-card button+ p{font-size:11px}.reader .refresh-plan{background:transparent!important;border:0!important;margin-top:12px;text-decoration:underline}.reader .output{padding:38px 0 45px}.reader .output-heading{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:22px}.reader .output-heading h2{font-size:25px;font-weight:650;letter-spacing:-.8px}.reader .output-heading p{font-size:11px;color:var(--muted)}.reader .output-card{margin-bottom:18px}.reader .output-card h3{font-size:17px;font-weight:650;margin-bottom:16px}.reader .output-card p,.reader .output-card li{font-size:13px;line-height:1.8;color:#bdcbbf}.reader .output-card ul{padding-left:18px}.reader .facts{display:flex;flex-wrap:wrap;gap:12px 26px;border-top:1px solid var(--line);margin-top:18px;padding-top:18px}.reader strong{font-weight:600;color:#e2eadf}.reader .details-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.reader .shot{border-top:1px solid var(--line);padding:20px 0}.reader .shot:first-of-type{border-top:0;padding-top:0}.reader .shot:last-child{padding-bottom:0}.reader .shot h4{font-size:14px;font-weight:600;margin-bottom:10px}.reader .shot .shot-number{color:var(--lime);font-family:monospace;margin-right:12px}.reader .shot .shot-meta{display:flex;flex-wrap:wrap;gap:8px 24px;margin-top:12px}.reader footer{border-top:1px solid var(--line);margin-top:36px;padding:20px 0;color:#99a79b;font:9px monospace;letter-spacing:1px;display:flex;justify-content:space-between;gap:15px;line-height:1.6}
@media(max-width:850px){.reader .shell{padding:0 22px}.reader .layout{grid-template-columns:1fr}.reader .plan-card{margin-bottom:10px}.reader .details-grid{grid-template-columns:1fr}}@media(max-width:480px){.reader .shell{padding:0 16px}.reader .input-card,.reader .plan-card,.reader .output-card{padding:20px}.reader .header-inner{min-height:70px}.reader .brand{font-size:20px}.reader .back{font-size:11px}.reader .intro{padding-top:30px}.reader .input-header{gap:12px}.reader .switcher button{padding:10px 12px}.reader .primary{width:100%;text-align:center}.reader .form-footer{align-items:stretch;flex-direction:column}.reader textarea{padding:13px;min-height:300px}.reader .output-heading{align-items:flex-start;flex-direction:column}.reader footer{flex-direction:column}}
`;

export default function AnalyzePage() {
  const [mode, setMode] = useState("text");
  const [screenplay, setScreenplay] = useState("");
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [readingPdf, setReadingPdf] = useState(false);
  const [access, setAccess] = useState(null);
  const [accessStatus, setAccessStatus] = useState("loading");
  const [analysis, setAnalysis] = useState(null);
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pdfSelection = useRef(0);
  const resultsRef = useRef(null);
  const words = screenplay.trim() ? screenplay.trim().split(/\s+/u).length : 0;

  const loadAccess = useCallback(async (signal) => {
    setAccessStatus("loading");
    try {
      const response = await fetch("/api/analyze", { cache: "no-store", signal });
      const result = await response.json();
      if (signal?.aborted) return;
      if (response.status === 401) { setAccess(null); setAccessStatus("unauth"); return; }
      if (!response.ok) throw new Error("Plan check failed");
      setAccess(result);
      setAccessStatus("ready");
    } catch {
      if (!signal?.aborted) setAccessStatus("error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadAccess(controller.signal);
    return () => controller.abort();
  }, [loadAccess]);

  useEffect(() => {
    if (analysis) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [analysis]);

  async function choosePdf(selected) {
    const selection = ++pdfSelection.current;
    setAnalysis(null); setSource(null); setError(""); setFile(null); setPageCount(null);
    if (!selected) { setReadingPdf(false); return; }
    const maxBytes = access?.maxFileBytes || 3 * 1024 * 1024;
    if (selected.size > maxBytes) { setReadingPdf(false); setError("Choose a PDF under 3 MB. You can compress or split larger files."); return; }
    if (!selected.name.toLowerCase().endsWith(".pdf")) { setReadingPdf(false); setError("Choose a PDF screenplay (.pdf)."); return; }
    setReadingPdf(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.load(await selected.arrayBuffer(), { throwOnInvalidObject: true });
      const pages = pdf.getPageCount();
      if (!pages) throw new Error("Empty PDF");
      if (selection === pdfSelection.current) { setFile(selected); setPageCount(pages); }
    } catch {
      if (selection === pdfSelection.current) setError("This PDF cannot be read. Export an unlocked PDF and try again.");
    } finally {
      if (selection === pdfSelection.current) setReadingPdf(false);
    }
  }

  function changeMode(next) { setMode(next); setAnalysis(null); setSource(null); setError(""); }
  function useSample() { changeMode("text"); setScreenplay(SAMPLE); }
  const overLimit = accessStatus === "ready" && !access?.isPro &&
    (mode === "text" ? words > access.wordLimit : pageCount > access.pageLimit);
  const ready = mode === "text" ? screenplay.trim().length >= 30 : Boolean(file && pageCount);

  async function analyzeScript(event) {
    event.preventDefault();
    if (loading || readingPdf || !ready || overLimit || accessStatus !== "ready") return;
    setLoading(true); setError(""); setAnalysis(null); setSource(null);
    try {
      let options;
      if (mode === "pdf") {
        const form = new FormData(); form.append("pdf", file);
        options = { method: "POST", body: form };
      } else {
        options = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ screenplay }) };
      }
      const response = await fetch("/api/analyze", options);
      const result = await response.json().catch(() => ({}));
      if (result.plan) setAccess(result);
      if (response.status === 401) setAccessStatus("unauth");
      if (!response.ok) throw new Error(result.error || "Unable to finish the analysis. Try a smaller file or section.");
      setAnalysis(result.analysis); setSource(result.source);
    } catch (err) { setError(err.message || "Analysis failed. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="reader">
      <title>Screenplay reader — FRAMEWORK</title>
      <style>{styles}</style>
      <header><div className="shell header-inner"><Link className="brand" href="/">FRAMEWORK<span>.</span></Link><Link className="back" href="/dashboard">← Back to workspace</Link></div></header>
      <main className="shell">
        <section className="intro"><p className="eyebrow">THE SCREENPLAY READER</p><h1>Your story. <em>A clearer plan.</em></h1><p>Upload a screenplay PDF or paste your scene. Turn the page into a practical starting point for set.</p></section>
        <div className="layout">
          <section className="input-card" aria-label="Screenplay input">
            <form onSubmit={analyzeScript}>
              <div className="input-header">
                <div className="switcher" role="group" aria-label="Input method"><button type="button" aria-pressed={mode === "text"} onClick={() => changeMode("text")} disabled={loading}>Paste text</button><button type="button" aria-pressed={mode === "pdf"} onClick={() => changeMode("pdf")} disabled={loading}>Upload PDF</button></div>
                <button className="sample" type="button" onClick={useSample} disabled={loading}>Try a sample script ↗</button>
              </div>
              {mode === "text" ? <>
                <div className="label-row"><label htmlFor="screenplay">Your screenplay</label><span className={`counter ${overLimit ? "over" : ""}`} aria-live="polite">{words.toLocaleString()}{access?.wordLimit ? ` / ${access.wordLimit}` : ""} words</span></div>
                <textarea id="screenplay" required minLength={30} disabled={loading} value={screenplay} onChange={(event) => { setScreenplay(event.target.value); setAnalysis(null); setSource(null); setError(""); }} placeholder={'INT. COFFEE SHOP - NIGHT\n\nRain traces the window. Your scene starts here...'} aria-describedby="text-help"/>
                <p className="help" id="text-help">{access?.isPro ? "Pro access: no free-tier word limit. For very long scripts, analyze smaller sections for more detailed results." : "Free demo: up to 600 words per analysis — roughly three screenplay pages. Page length varies with formatting."}</p>
              </> : <>
                <div className="label-row"><label htmlFor="screenplay-pdf">Your screenplay PDF</label><span className={`counter ${overLimit ? "over" : ""}`} aria-live="polite">{pageCount ? `${pageCount} page${pageCount === 1 ? "" : "s"}` : "PDF · up to 3 MB"}</span></div>
                <div className="upload-area"><span className="upload-icon" aria-hidden="true">↥</span><h2>Bring your screenplay.</h2><p>{access?.isPro ? "Pro removes the three-page limit. Upload one PDF of any page count, up to 3 MB." : "Try the reader with a PDF of up to three pages, including title pages."}</p><input id="screenplay-pdf" type="file" accept=".pdf,application/pdf" onChange={(event) => choosePdf(event.target.files?.[0])} disabled={loading} aria-describedby="pdf-help"/>{readingPdf && <p role="status">Reading page count…</p>}{file && <div className="file-info">{file.name}<br/>{pageCount} pages · {(file.size / 1024).toFixed(0)} KB</div>}</div>
                <p className="help" id="pdf-help">PDF only · 3 MB maximum per file · Export password-protected files as unlocked PDFs. Pro has no product page cap; very large scripts may need to be split to fit the AI reader.</p>
              </>}
              {overLimit && <div className="message" role="alert">{mode === "text" ? "This script is over the 600-word free limit." : `This PDF has ${pageCount} pages. The free limit is three.`} Shorten your excerpt or use Pro below.</div>}
              {accessStatus === "unauth" && <div className="message"><Link href="/auth/sign-in">Sign in</Link> or <Link href="/auth/sign-up">create a free account</Link> to analyze your script.</div>}
              {accessStatus === "error" && <div className="message" role="alert">Unable to check your plan. <button className="sample" type="button" onClick={() => loadAccess()}>Try again</button></div>}
              {error && <p className="message" role="alert">{error}</p>}
              <div className="form-footer"><button className="primary" type="submit" disabled={loading || readingPdf || !ready || overLimit || accessStatus !== "ready"}>{loading ? "Reading your script…" : accessStatus === "loading" ? "Checking access…" : "Analyze screenplay ↗"}</button><p className="privacy">Used for this analysis. FRAMEWORK doesn’t save a copy of your uploaded script.</p></div>
              {loading && <p className="help" role="status">Building your breakdown and shot suggestions. Larger scripts can take a little longer.</p>}
            </form>
          </section>
          <aside className="plan-card" aria-label="Reader access and limits">
            <span className="plan-badge">{accessStatus === "loading" ? "CHECKING ACCESS" : access?.isDemo ? "DEMO · PRO ACCESS" : access?.isPro ? "PRO ACCESS" : "FREE DEMO"}</span>
            <h2>{access?.isPro ? "Read beyond the scene." : "Try your first scene."}</h2>
            <p className="small">{access?.isPro ? "Your account has Pro access. The free reader limits don’t apply." : "Explore what FRAMEWORK can do before upgrading."}</p>
            <ul><li>{access?.isPro ? "No three-page PDF limit" : "Up to 3 PDF pages per analysis"}</li><li>{access?.isPro ? "No free-tier text limit" : "Up to 600 pasted words"}</li><li>Scene breakdown and shot ideas</li><li>Characters, props, and production notes</li></ul>
            {!access?.isPro && <div className="divider"><p className="eyebrow">FRAMEWORK PRO · $5</p><h2>The whole script.<br/>More possibilities.</h2><p className="small">Remove the three-page PDF limit and the 600-word text limit. PDFs up to 3 MB per file.</p>{accessStatus === "ready" ? <UpgradeButton/> : <Link className="primary" href="/auth/sign-up">Create a free account ↗</Link>}<p className="help">Stripe test checkout · No real charges</p></div>}
            {access?.isPro && <div className="divider"><p className="eyebrow">MAKE IT YOURS</p><p className="small">AI suggestions are a starting point. Adapt them to your vision, crew, and locations.</p></div>}
            {accessStatus === "ready" && <button className="refresh-plan" type="button" onClick={() => loadAccess()} disabled={loading}>Refresh plan access</button>}
          </aside>
        </div>
        {analysis && <section className="output" aria-label="Production analysis" ref={resultsRef} tabIndex={-1}>
          <div className="output-heading"><h2>Your production starting point.</h2><p>{source?.type === "pdf" ? `${source.pages} PDF pages analyzed` : `${source?.words || words} words analyzed`}</p></div>
          <article className="output-card"><h3>Scene breakdown</h3><p>{analysis.scene_summary}</p><div className="facts"><p><strong>Location:</strong> {analysis.location}</p><p><strong>Time:</strong> {analysis.time_of_day}</p></div></article>
          <div className="details-grid"><article className="output-card"><h3>Characters</h3><ul>{analysis.characters.map((item, i) => <li key={i}>{item}</li>)}</ul></article><article className="output-card"><h3>Props</h3><ul>{analysis.props.map((item, i) => <li key={i}>{item}</li>)}</ul></article></div>
          <article className="output-card"><h3>Suggested shot list</h3>{analysis.shots.map((shot, i) => <div className="shot" key={i}><h4><span className="shot-number">{String(i + 1).padStart(2, "0")}</span>{shot.shot_type}</h4><p>{shot.description}</p><div className="shot-meta"><p><strong>Movement:</strong> {shot.camera_movement}</p><p><strong>Purpose:</strong> {shot.purpose}</p></div></div>)}</article>
          <article className="output-card"><h3>Production notes</h3><ul>{analysis.production_notes.map((item, i) => <li key={i}>{item}</li>)}</ul></article>
        </section>}
        <footer><span>FRAMEWORK / FROM THE PAGE TO THE FRAME</span><span>CREATED BY LANDON CLARKEN · 2026</span></footer>
      </main>
    </div>
  );
}
