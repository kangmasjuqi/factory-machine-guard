# 🏭 Factory Machine Guard

## 📋 Overview

**Factory Machine Guard** is a web-based monitoring system designed to help factories identify and classify potential machine issues based on sound anomalies.

### 🔍 Use Case
Every day, employees record noise from running **CNC** and **Milling Machines** in `.wav` format. These recordings are uploaded to the app as *"anomalies"*. Through the dashboard, supervisors and engineers can:
- Visualize the waveform and spectrogram of each audio file.
- Analyze noise patterns.
- Tag anomalies with suspected reasons and required actions.

---

## 🧰 Tech Stack

- **Backend**: Node.js with Express.js
- **Frontend**: React.js
- **Database**: PostgreSQL

### 🧪 Development Environment

| Tool       | Version        |
|------------|----------------|
| Node.js    | v20.19.2       |
| npm        | v10.8.2        |
| PostgreSQL | v14.18         |

---

## 🚨 Alert Features

### 📄 Alert List

- Displays all submitted anomalies
- Each anomaly includes:
  - Auto-generated **ID**
  - **Detection Timestamp**
  - **Machine Type**
  - **Alert Severity**: `Mild` (🟢), `Moderate` (🟠), `Severe` (🔴)
  - **Date Filtering** for timeline navigation

### 🎧 Alert Content

- Waveform and Spectrogram generation (up to **8 kHz** max frequency)
- Inline playback of `.wav` audio clips
- Input for review includes:
  - **Suspected Reason**
  - **Action Required**
  - **Freeform Comments**
  - **Update Button** to save the review

---

## 🧾 Sample Data Structures

### Anomaly

```json
[
  {
    "Timestamp": 1628676001,
    "Machine": "CNC Machine",
    "Anomaly": "Mild",
    "Sensor": "1234567890",
    "SoundClip": "1.wav"
  },
  ...
]
```

### Reason

```json
[
  { "Machine": "CNC Machine", "Reason": "Spindle Error" },
  { "Machine": "Milling Machine", "Reason": "Machine Crash" }
]
```

### Action

```json
[
  { "Action": "Immediate" },
  { "Action": "Later" },
  { "Action": "No Action" }
]
```

---

## ⚙️ Setup Instructions

### Backend

```bash
cd backend
cp .env.example .env         # Configure environment variables
npm install                  # Install dependencies
# Create database manually in PostgreSQL
# Then run these scripts:
#   0_ddl.sql
#   1_actions.sql
#   2_reasons.sql
#   3_anomalies.sql
```

### Frontend

```bash
cd frontend
cp .env.example .env         # Configure environment variables
npm install                  # Install dependencies
```

---

## ▶️ Running the App

### Backend

```bash
npm start
```

### Frontend

```bash
npm start
```

---

## 🧪 API Examples

### Update Anomaly

```bash
curl -X PUT http://localhost:4000/api/anomalies/1 \
  -H "Content-Type: application/json" \
  -d '{
    "suspected_reason": "Machine failure",
    "action_required": "Later",
    "comments": "Noise occurred during shift B"
  }'
```

### Get All Anomalies

```bash
curl -X GET http://localhost:4000/api/anomalies
```

---

## 📌 Note

- Use `.env` files to customize `API_BASE_URL` and DB settings.
- Make sure PostgreSQL is running before starting the backend.

---

## 💡 Future Enhancements

- Automatic anomaly classification using ML
- User login and roles (Operator, Engineer, Admin)
- Alert notifications (e.g., Slack, Email)
