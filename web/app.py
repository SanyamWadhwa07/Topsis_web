
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import os
from werkzeug.utils import secure_filename
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask_cors import CORS
from Topsis_Sanyam_102303059.topsis import topsis

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

## Using topsis from PyPI package



def style_html_table(html):
    html = html.replace(
        '<table border="1" class="dataframe">',
        '<table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;background:#fff;" border="1">'
    )
    html = html.replace(
        '<th>',
        '<th style="background:#2a7ae2;color:#fff;padding:8px;border:1px solid #ddd;text-align:center;">'
    )
    html = html.replace(
        '<td>',
        '<td style="padding:8px;border:1px solid #ddd;text-align:center;">'
    )
    return html


def generate_summary(df):
    summary = "TOPSIS Results:\n\n"
    sorted_df = df.sort_values("Rank")
    for _, row in sorted_df.iterrows():
        summary += (
            f"Rank {int(row['Rank'])}: {row[df.columns[0]]} "
            f"(Score: {row['Topsis Score']:.4f})\n"
        )
    return summary

@app.route('/process', methods=['POST'])
def process():
    file = request.files['csvfile']
    weights = request.form['weights']
    impacts = request.form['impacts']
    email = request.form.get('email', None)
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    df = pd.read_csv(filepath)
    weight_list = [float(w.strip()) for w in weights.split(',')]
    impact_list = [i.strip() for i in impacts.split(',')]
    scores, ranks = topsis(df, weight_list, impact_list)
    df['Topsis Score'] = scores
    df['Rank'] = ranks.astype(int)
    summary = generate_summary(df)
    result_html = df.to_html(index=False)
    styled_html = style_html_table(result_html)
    if email:
        send_email(email, summary)
    return jsonify({"table": styled_html, "summary": summary})

def send_email(to_email, html_content):
    # Configure your SMTP settings here
    smtp_server = 'smtp.example.com'
    smtp_port = 587
    smtp_user = 'your_email@example.com'
    smtp_password = 'your_password'
    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'TOPSIS Results'
    msg['From'] = smtp_user
    msg['To'] = to_email
    part = MIMEText(html_content, 'plain')
    msg.attach(part)
    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, to_email, msg.as_string())
    except Exception as e:
        print(f"Email error: {e}")

from flask import send_from_directory
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    build_dir = os.path.join(os.path.dirname(__file__), 'build')
    if path != "" and os.path.exists(os.path.join(build_dir, path)):
        return send_from_directory(build_dir, path)
    else:
        return send_from_directory(build_dir, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)