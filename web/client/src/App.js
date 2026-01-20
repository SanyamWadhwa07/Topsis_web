import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';

function App() {
  const [csvFile, setCsvFile] = useState(null);
  const [weights, setWeights] = useState('');
  const [impacts, setImpacts] = useState('');
  const [email, setEmail] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('csvfile', csvFile);
    formData.append('weights', weights);
    formData.append('impacts', impacts);
    // Send to backend for calculation
    const res = await fetch('http://localhost:5000/process', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setResult(data.table);
    // If email is requested, send summary via EmailJS
    if (sendEmail && email) {
      emailjs.send(
        'service_es9nhxm', // your EmailJS service ID
        'template_tijodbg', // your EmailJS template ID
        {
          to_email: email,
          message: data.summary,
        },
        'BMMJuds3c21F1ypKg' // your EmailJS public key
      ).then(
        () => alert('Results sent to your email!'),
        (error) => alert('Failed to send email: ' + error.text)
      );
    }
    setLoading(false);
  };

  return (
    <div className="topsis-container">
      <div className="topsis-title">TOPSIS WEB SERVICE</div>
      <div className="topsis-subtitle">MULTI-CRITERIA DECISION ANALYSIS TOOL</div>
      <form className="topsis-form" onSubmit={handleSubmit}>
        <a
          href="/sample.csv"
          download="sample.csv"
          style={{ marginBottom: "10px", display: "block" }}
        >
          Download Sample CSV File
        </a>
        <label>UPLOAD CSV FILE *</label>
        <input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files[0])} required />
        <div className="input-desc">First column: option names, remaining columns: numeric criteria values</div>

        <label>WEIGHTS *</label>
        <input type="text" value={weights} onChange={e => setWeights(e.target.value)} required placeholder="e.g., 1,1,1,2" />
        <div className="input-desc">Comma-separated numeric values (importance of each criterion)</div>

        <label>IMPACTS *</label>
        <input type="text" value={impacts} onChange={e => setImpacts(e.target.value)} required placeholder="e.g., +,+,-,+" />
        <div className="input-desc">Comma-separated + or - (+ for maximize, - for minimize)</div>

        <div className="checkbox-row">
          <input type="checkbox" id="sendEmail" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)} />
          <label htmlFor="sendEmail" style={{marginBottom:0}}>SEND RESULTS TO EMAIL (OPTIONAL)</label>
        </div>
        {sendEmail && (
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required />
        )}

        <button type="submit" disabled={loading}>{loading ? 'Processing...' : 'CALCULATE TOPSIS'}</button>
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
