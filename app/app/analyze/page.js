"use client";

import { useState } from "react";
import Link from "next/link";

export default function AnalyzePage() {
  const [screenplay, setScreenplay] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeScript(event) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ screenplay })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Analysis failed.");
      }

      setAnalysis(result.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const panel = {
    background: "#18243a",
    padding: 24,
    borderRadius: 12,
    marginTop: 20
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0d1422",
      color: "white",
      padding: "40px 20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{ maxWidth: 900, margin: "auto" }}>
        <Link href="/dashboard" style={{ color: "#9bbcf3" }}>
          Back to Dashboard
        </Link>

        <h1 style={{ marginTop: 30 }}>FRAMEWORK</h1>
        <h2>AI Screenplay Analyzer</h2>
        <p style={{ color: "#aabbd2" }}>
          Turn your screenplay into a production-ready starting point.
        </p>

        <form onSubmit={analyzeScript}>
          <label htmlFor="screenplay">Paste your screenplay:</label>
          <textarea
            id="screenplay"
            value={screenplay}
            onChange={(e) => setScreenplay(e.target.value)}
            minLength={30}
            maxLength={8000}
            required
            placeholder="INT. COFFEE SHOP - NIGHT..."
            style={{
              display: "block",
              width: "100%",
              minHeight: 260,
              marginTop: 12,
              marginBottom: 18,
              padding: 16,
              background: "#1a2940",
              color: "white",
              border: "1px solid #536b8c",
              borderRadius: 10,
              fontSize: 15,
              boxSizing: "border-box"
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px 24px",
              background: "#6fa4f5",
              color: "#081321",
              border: 0,
              borderRadius: 8,
              cursor: loading ? "wait" : "pointer",
              fontWeight: "bold"
            }}
          >
            {loading ? "Analyzing..." : "Analyze Screenplay"}
          </button>
        </form>

        {error && (
          <p role="alert" style={{ color: "#ff9b9b" }}>
            {error}
          </p>
        )}

        {analysis && (
          <section aria-label="Production analysis">
            <div style={panel}>
              <h2>Scene Breakdown</h2>
              <p>{analysis.scene_summary}</p>
              <p><strong>Location:</strong> {analysis.location}</p>
              <p><strong>Time:</strong> {analysis.time_of_day}</p>
            </div>

            <div style={panel}>
              <h2>Characters</h2>
              <ul>
                {analysis.characters.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h2>Props</h2>
              <ul>
                {analysis.props.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={panel}>
              <h2>Suggested Shot List</h2>
              {analysis.shots.map((shot, i) => (
                <div key={i} style={{
                  borderBottom: "1px solid #40516a",
                  padding: "14px 0"
                }}>
                  <h3>Shot {i + 1}: {shot.shot_type}</h3>
                  <p>{shot.description}</p>
                  <p><strong>Movement:</strong> {shot.camera_movement}</p>
                  <p><strong>Purpose:</strong> {shot.purpose}</p>
                </div>
              ))}
            </div>

            <div style={panel}>
              <h2>Production Notes</h2>
              <ul>
                {analysis.production_notes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
