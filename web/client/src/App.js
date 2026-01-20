import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "./App.css";



function App() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [csvFile, setCsvFile] = useState(null);
  const [weights, setWeights] = useState("");
  const [impacts, setImpacts] = useState("");
  const [email, setEmail] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!csvFile) {
      alert("Please upload a CSV file.");
      return;
    }

    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("csvfile", csvFile);
    formData.append("weights", weights);
    formData.append("impacts", impacts);

    let response;

    try {
      response = await fetch(`${API_URL}/process`, {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      alert("Backend server is unreachable.");
      setLoading(false);
      return;
    }

    if (!response.ok) {
      alert("TOPSIS processing failed.");
      setLoading(false);
      return;
    }

    const data = await response.json();
    setResult(data.table);

    if (sendEmail && email) {
      try {
        await emailjs.send(
          process.env.REACT_APP_EMAIL_SERVICE_ID,
          process.env.REACT_APP_EMAIL_TEMPLATE_ID,
          {
            to_email: email,
            message: data.summary,
          },
          process.env.REACT_APP_EMAIL_PUBLIC_KEY
        );

        alert("Results sent to your email.");
      } catch (err) {
        alert("Email sending failed.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="topsis-container">
      <div className="topsis-title">TOPSIS WEB SERVICE</div>
      <div className="topsis-subtitle">
        MULTI-CRITERIA DECISION ANALYSIS TOOL
      </div>

      <form className="topsis-form" onSubmit={handleSubmit}>
        
          <a 
          href="/sample.csv" download
          style={{ marginBottom: "10px", display: "block" }}>
        
          Download Sample CSV File
        </a>

        <label>UPLOAD CSV FILE *</label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files[0])}
          required
        />

        <div className="input-desc">
          First column: alternatives, remaining columns: criteria values
        </div>

        <label>WEIGHTS *</label>
        <input
          type="text"
          value={weights}
          onChange={(e) => setWeights(e.target.value)}
          placeholder="e.g. 1,1,1,2"
          required
        />

        <div className="input-desc">
          Comma-separated numeric weights
        </div>

        <label>IMPACTS *</label>
        <input
          type="text"
          value={impacts}
          onChange={(e) => setImpacts(e.target.value)}
          placeholder="+,+,-,+"
          required
        />

        <div className="input-desc">
          + for benefit, − for cost criteria
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            checked={sendEmail}
            onChange={(e) => setSendEmail(e.target.checked)}
          />
          <label style={{ marginBottom: 0 }}>
            SEND RESULTS TO EMAIL
          </label>
        </div>

        {sendEmail && (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "CALCULATE TOPSIS"}
        </button>
      </form>

      {result && (
        <div className="topsis-result">
          <h3>Results</h3>
          <div dangerouslySetInnerHTML={{ __html: result }} />
        </div>
      )}
    </div>
  );
}

export default App;
