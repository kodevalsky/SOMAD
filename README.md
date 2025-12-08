# SOMAD - Social Media Misinformation Analysis and Detection

SOMAD is a modern web application designed to analyze and detect misinformation in social media posts. It leverages a fine-tuned **BERT** model for multi-label classification and **Google's Gemini LLM** for deep semantic analysis and explainability.

![SOMAD Analysis Page](https://via.placeholder.com/800x400?text=SOMAD+Analysis+Dashboard)

## 🚀 Features

-   **Multi-Modal Input**: Analyze text directly or paste a URL from social media platforms.
-   **Hybrid AI Analysis**:
    -   **BERT Classifier**: Instantly categorizes content as True, False, Satire, Misleading, etc.
    -   **Gemini LLM**: Provides a detailed, human-readable summary, fact-checking assessment, and confidence score.
-   **Visual Metrics**:
    -   **Radar Chart**: Visualizes abstract metrics like *Sensationability*, *Controversy*, *Conspiracy*, *Absurdness*, and *Emotionality*.
    -   **Probability Distribution**: Interactive bar charts showing the model's confidence across all possible labels.
-   **Smart Safeguards**: Automatically flags results as "Inconclusive" if the model is uncertain (top predictions within 15%).
-   **Modern UI**: Built with **React**, **TailwindCSS**, and **Shadcn UI** for a sleek, dark-themed experience.

## 🛠️ Tech Stack

### Backend
-   **Framework**: Django & Django REST Framework (Python)
-   **ML Engine**: Hugging Face Transformers (PyTorch)
-   **LLM Integration**: Google Generative AI SDK (Gemini)
-   **Content Extraction**: RapidAPI (Social Download All-in-One)

### Frontend
-   **Framework**: React (Vite)
-   **Styling**: TailwindCSS
-   **Components**: Shadcn UI
-   **Visualization**: Recharts

## 📦 Prerequisites

-   **Python** 3.10+
-   **Node.js** 18+
-   **uv** (Python package manager)
-   **Yarn** or **npm**

## ⚡ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/somad.git
cd somad
```

### 2. Backend Setup
Navigate to the backend directory and set up the environment:

```bash
cd backend

# Install dependencies using uv
uv sync

# Run migrations
uv run manage.py migrate

# Start the server
uv run manage.py runserver
```
*The backend will run on `http://localhost:8000`.*

> **Note**: Ensure you have the fine-tuned BERT model files in `backend/ml_models/`.

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:

```bash
cd frontend

# Install dependencies
yarn install

# Start the development server
yarn dev
```
*The frontend will run on `http://localhost:5173`.*

## 🔑 Environment Variables

The project currently uses hardcoded keys for demonstration purposes (in `backend/api/services.py`). For production, you should move these to a `.env` file:

-   `GOOGLE_API_KEY`: For Gemini analysis.
-   `RAPIDAPI_KEY`: For fetching social media content.

## 🧠 Model Details

-   **BERT Model**: A `bert-base-uncased` model fine-tuned on a diverse dataset of fact-checked news and social media posts.
-   **Gemini Model**: Uses `gemini-2.5-flash` for fast, cost-effective summarization and metric generation.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
