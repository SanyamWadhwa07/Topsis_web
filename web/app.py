from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import os
from Topsis_Sanyam_102303059.topsis import topsis

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "OPTIONS"]
)


@app.route("/", methods=["GET"])
def health():
    return "TOPSIS backend running"
@app.route("/process", methods=["POST"])
def process():
    file = request.files.get("csvfile")
    weights = request.form.get("weights")
    impacts = request.form.get("impacts")

    if not file:
        return jsonify({"error": "CSV file missing"}), 400

    try:
        df = pd.read_csv(file)
    except Exception:
        return jsonify({"error": "Invalid CSV file"}), 400

    try:
        weight_list = [float(w.strip()) for w in weights.split(",")]
        impact_list = [i.strip() for i in impacts.split(",")]
    except Exception:
        return jsonify({"error": "Invalid weights or impacts format"}), 400

    # Ensure numeric criteria
    try:
        criteria_df = df.iloc[:, 1:].apply(pd.to_numeric, errors="raise")
    except Exception:
        return jsonify({"error": "All criteria columns must be numeric"}), 400

    criteria_count = criteria_df.shape[1]

    if len(weight_list) != criteria_count:
        return jsonify({
            "error": f"Expected {criteria_count} weights, got {len(weight_list)}"
        }), 400

    if len(impact_list) != criteria_count:
        return jsonify({
            "error": f"Expected {criteria_count} impacts, got {len(impact_list)}"
        }), 400

    clean_df = pd.concat([df.iloc[:, 0], criteria_df], axis=1)

    scores, ranks = topsis(clean_df, weight_list, impact_list)

    clean_df["Topsis Score"] = scores
    clean_df["Rank"] = ranks.astype(int)

    result_html = clean_df.to_html(index=False)

    summary = "\n".join(
        f"Rank {int(row['Rank'])}: {row[clean_df.columns[0]]} "
        f"(Score: {row['Topsis Score']:.4f})"
        for _, row in clean_df.sort_values("Rank").iterrows()
    )

    return jsonify({
        "table": result_html,
        "summary": summary
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
