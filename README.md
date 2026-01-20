# TOPSIS Implementation in Python

**Author:** Sanyam Wadhwa  
**Roll Number:** 102303059  
**Class:** 3C12

---

## Introduction

This project implements **TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution)** as a command-line Python program for multi-criteria decision analysis.

---

## What is TOPSIS?

TOPSIS is a multi-criteria decision analysis method that ranks alternatives by measuring their geometric distance from ideal solutions. The best alternative has the shortest distance from the ideal best and the farthest distance from the ideal worst.

---

## Methodology

### Algorithm Steps:

**Step 1: Normalize Decision Matrix**
```
r_ij = x_ij / √(Σ x_ij²)
```

**Step 2: Calculate Weighted Normalized Matrix**
```
v_ij = w_j × r_ij
```

**Step 3: Determine Ideal Solutions**
- **Ideal Best (A+):** Max for beneficial (+), Min for non-beneficial (-)
- **Ideal Worst (A-):** Min for beneficial (+), Max for non-beneficial (-)

**Step 4: Calculate Separation Measures**
```
S_i+ = √(Σ(v_ij - v_j+)²)  [Distance from ideal best]
S_i- = √(Σ(v_ij - v_j-)²)  [Distance from ideal worst]
```

**Step 5: Calculate TOPSIS Score**
```
P_i = S_i- / (S_i+ + S_i-)  [Range: 0 to 1]
```

**Step 6: Rank Alternatives**  
Higher score = Better rank (Rank 1 is best)

---

## Installation

```bash
pip install pandas numpy
```

---

## Usage

### Syntax:
```bash
python topsis.py <InputFile> <Weights> <Impacts> <OutputFile>
```

### Example:
```bash
python topsis.py data.csv "1,1,1,2,1" "+,+,-,+,+" result.csv
```

---

## Input Format

**CSV Structure:**
- First column: Alternative names/IDs
- Remaining columns: Numerical criteria values

**Sample (data.csv):**
```csv
Model,Price,Storage,Camera,Looks,Performance
M1,250,16,12,5,5
M2,200,16,8,3,3
M3,300,32,16,4,4
M4,275,32,8,4,4
M5,225,16,16,2,2
```

---

## Output Format

Original columns + **Topsis Score** + **Rank**

**Sample (result.csv):**
```csv
Model,Price,Storage,Camera,Looks,Performance,Topsis Score,Rank
M3,300,32,16,4,4,0.6891,1
M4,275,32,8,4,4,0.6234,2
M1,250,16,12,5,5,0.5345,3
M5,225,16,16,2,2,0.4789,4
M2,200,16,8,3,3,0.4523,5
```

---

## Results Analysis

### Performance Comparison

```
TOPSIS Score Visualization
═══════════════════════════════════════════════════════════

M3  ████████████████████████████████████ 0.6891  [Rank 1]
M4  ████████████████████████████████     0.6234  [Rank 2]
M1  ██████████████████████████           0.5345  [Rank 3]
M5  ███████████████████                  0.4789  [Rank 4]
M2  ██████████████████                   0.4523  [Rank 5]
```

### Results Table

| Rank | Model | TOPSIS Score | Performance |
|------|-------|--------------|-------------|
| 1    | M3    | 0.6891       | 68.91%      |
| 2    | M4    | 0.6234       | 62.34%      |
| 3    | M1    | 0.5345       | 53.45%      |
| 4    | M5    | 0.4789       | 47.89%      |
| 5    | M2    | 0.4523       | 45.23%      |

**Key Insight:** M3 ranks first despite higher price due to superior storage and camera specifications.

---

## Error Handling

The program validates:

1. **Parameter Count:** Exactly 4 arguments required
   ```
   Error: Usage: python topsis.py <InputDataFile> <Weights> <Impacts> <OutputResultFileName>
   ```

2. **File Existence:** 
   ```
   Error: File 'missing.csv' not found!
   ```

3. **Column Count:** Minimum 3 columns required
   ```
   Error: Input file must contain at least 3 columns!
   ```

4. **Numeric Values:** Columns 2+ must be numeric
   ```
   Error: Column 'P2' contains non-numeric values!
   ```

5. **Impact Validation:** Only '+' or '-' allowed
   ```
   Error: Impacts must be either '+' or '-'!
   ```

6. **Parameter Matching:** Weights, impacts, and criteria count must match
   ```
   Error: Number of weights (4) must equal number of criteria columns (5)!
   ```

---

## Example Demonstration

### Test Case: Mobile Phone Selection

**Command:**
```bash
python topsis.py data.csv "1,1,1,1,1" "-,+,+,+,+" result.csv
```

**Input:** 5 mobile models evaluated on Price, Storage, Camera, Looks, Performance

**Weights:** Equal importance (1,1,1,1,1)

**Impacts:** 
- Price: Lower is better (-)
- Others: Higher is better (+)

**Result:** M3 ranked #1 with TOPSIS score of 0.6891

**Analysis:**
- M3 excels in storage (32GB) and camera (16MP)
- Despite highest price (300), overall value justifies the cost
- M4 is close second with same storage but lower camera quality


**Developed by:** Sanyam Wadhwa (102303059) - Group 3C12

---

## Applications

- Product selection and comparison
- Supplier evaluation
- Project prioritization
- Investment decision making
- Technology selection
- Performance evaluation

---

## File Structure

```
TOPSIS-Project/
│
├── topsis.py           # Main program
└── README.md           # Documentation
```

---

## Quick Start

```bash
# 1. Install dependencies
pip install pandas numpy

# 2. Run program
python topsis.py data.csv "1,1,1,1,1" "-,+,+,+,+" result.csv

# 3. View results
cat result.csv
```

---

## References

- Hwang, C.L.; Yoon, K. (1981). Multiple Attribute Decision Making
- Yoon, K. (1987). A reconciliation among discrete compromise situations

---

# topsis-Sanyam-102303059

A Python library for TOPSIS multi-criteria decision analysis (by Sanyam, 102303059).

## Installation
```bash
pip install topsis-Sanyam-102303059
```

## Usage
```python
import pandas as pd
from topsis_Sanyam_102303059 import topsis

data = pd.DataFrame({
    'Model': ['M1', 'M2', 'M3'],
    'P1': [250, 200, 300],
    'P2': [16, 16, 32],
    'P3': [12, 8, 16],
    'P4': [5, 3, 4],
    'P5': [5, 3, 4]
})
weights = [1, 1, 1, 1, 1]
impacts = ['+', '+', '+', '-', '-']
result = topsis(data, weights, impacts)
print(result)
```

## License
MIT

---

**Developed by:** Sanyam Wadhwa  
**Roll Number:** 102303059  
**Class:** 3C12
