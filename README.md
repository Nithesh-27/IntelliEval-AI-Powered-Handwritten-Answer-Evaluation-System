# 🧠 IntelliEval – AI Handwritten Answer Evaluation System

**IntelliEval** is an AI-powered system that automatically evaluates **handwritten answer sheets** by extracting text using **Optical Character Recognition (OCR)** and comparing it with **reference answers using semantic similarity techniques**.

The system helps educators **automate grading**, reduce manual workload, and provide **objective and consistent evaluation of handwritten responses**.

---

# 🚀 Features

- Upload handwritten answer sheets
- Image preprocessing for improved OCR accuracy
- Text extraction using **AWS Textract**
- Semantic similarity based answer evaluation
- Automated score calculation
- Interactive evaluation dashboard
- Answer similarity visualization
- PDF report generation
- Modern animated UI

---

# 🧠 How It Works

The IntelliEval system processes handwritten answer sheets through multiple stages.

### 1️⃣ Image Upload
Users upload handwritten answer sheet images through the web interface.

### 2️⃣ Image Preprocessing
Using **OpenCV**, the system enhances images by:

- Noise reduction  
- Contrast enhancement  
- Image normalization  

This improves OCR accuracy.

### 3️⃣ Text Extraction (OCR)

The system uses **AWS Textract** to extract text from the handwritten image.

### 4️⃣ Semantic Answer Evaluation

The extracted student answer is compared with the **reference answer** using **Natural Language Processing (NLP)** techniques to measure semantic similarity.

### 5️⃣ Score Generation

The system calculates:

- Similarity score
- Evaluation grade
- Performance insights

### 6️⃣ Result Visualization

Results are displayed through an **interactive dashboard** showing similarity percentage and evaluation metrics.

### 7️⃣ PDF Report Generation

A detailed evaluation report can be exported as a **PDF file**.

---

# 🧪 Example Evaluation Flow

```
Handwritten Answer Image
        ↓
Image Preprocessing (OpenCV)
        ↓
Text Extraction (AWS Textract)
        ↓
Text Cleaning
        ↓
Semantic Similarity Evaluation
        ↓
Score Calculation
        ↓
Interactive Dashboard + PDF Report
```

---

# 🛠 Tech Stack

## Backend

| Technology | Purpose |
|------|------|
FastAPI | Backend API framework |
Python | Core programming language |
AWS Textract | Handwritten text extraction |
OpenCV | Image preprocessing |
NLP | Semantic similarity evaluation |

---

## Frontend

| Technology | Purpose |
|------|------|
HTML5 | Interface structure |
CSS3 | Styling |
JavaScript | UI interaction |
Canvas | Animated visualization |
jsPDF | PDF report generation |

---

# 📂 Project Structure

```
IntelliEval
│
├── backend
│   ├── utils
│   │   ├── preprocess.py
│   │   ├── ocr.py
│   │   └── evaluator.py
│
├── frontend
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── uploads
├── processed
│
├── app.py
├── requirements.txt
└── README.md
```

---

# ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/intellieval.git
cd intellieval
```

---

### 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 3️⃣ Configure AWS Textract

Set the following environment variables:

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
```

---

### 4️⃣ Run the Application

```bash
uvicorn app:app --reload
```

Server will start at:

```
http://127.0.0.1:8000
```

---

# 🎮 Usage

1️⃣ Upload a **handwritten answer sheet**

2️⃣ System processes the image and extracts text

3️⃣ Extracted answer is compared with the **reference answer**

4️⃣ A **similarity score and evaluation result** is generated

5️⃣ Download the **PDF evaluation report**

---

# 📊 Output Example

| Metric | Value |
|------|------|
Similarity Score | 82% |
Grade | A |
Matched Keywords | 14 |
Missing Concepts | 3 |

---

# 🎯 Applications

- Automated exam grading
- Educational assessment systems
- Online learning platforms
- Academic research
- Large-scale evaluation systems

---

# 🔮 Future Improvements

- Deep learning based handwriting recognition
- Transformer-based semantic evaluation
- Multi-question answer sheet evaluation
- Plagiarism detection
- Teacher feedback integration

---

# 👨‍💻 Author

**Nithesh K**

Machine Learning Enthusiast  
AI | Data Science | Intelligent Systems

---

# ⭐ Support

If you find this project useful, consider giving it a **star ⭐ on GitHub**.
