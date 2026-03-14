import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import shutil
import json
import uuid
from backend.utils.preprocess import preprocess_image
from backend.utils.ocr import TextractOCR
from backend.utils.evaluator import SemanticEvaluator

app = FastAPI(title="Handwritten Answer Evaluation API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
UPLOADS_DIR = "uploads"
PROCESSED_DIR = "processed"
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

# Initialize utilities
ocr_engine = TextractOCR()
eval_engine = SemanticEvaluator()

# Serve static files from the frontend directory
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Handle file upload and initial OCR extraction.
    """
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    file_path = os.path.join(UPLOADS_DIR, f"{file_id}{ext}")
    processed_path = os.path.join(PROCESSED_DIR, f"{file_id}_processed.jpg")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Preprocess
    try:
        preprocess_image(file_path, processed_path)
    except Exception as e:
        return {"error": f"Preprocessing failed: {str(e)}", "file_id": file_id}

    # Extract Text
    extracted_text = ocr_engine.extract_text_with_retry(processed_path)
    
    if not extracted_text:
        return {"error": "OCR failed to extract text", "file_id": file_id}

    return {
        "file_id": file_id,
        "extracted_text": extracted_text,
        "filename": file.filename
    }

@app.post("/evaluate")
async def evaluate_answers(
    extracted_text: str = Form(...),
    answer_key_json: str = Form(...)
):
    """
    Evaluate extracted text against a provided answer key.
    """
    try:
        answer_key = json.loads(answer_key_json)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid Answer Key JSON format")

    # In a real system, we'd have a more sophisticated way to map extracted text to questions.
    # For this POC, we'll assume the extracted text contains markers or we'll perform 
    # some basic multi-question parsing if the answer key has multiple entries.
    
    # Simplified parser: looks for "Question X:" or just evaluates the whole text 
    # against multiple answers if possible.
    # Here, we'll just mock a split or assume the user provides specific mappings if needed.
    
    # Mocking single question evaluation if key has 1 item, or split by lines if multiple.
    extracted_map = {}
    if len(answer_key) == 1:
        q_id = list(answer_key.keys())[0]
        extracted_map[q_id] = extracted_text
    else:
        # Simple heuristic split for multiple questions
        lines = extracted_text.split('\n')
        current_q = None
        current_txt = []
        for line in lines:
            if "Question" in line or "Q" in line:
                if current_q:
                    extracted_map[current_q] = " ".join(current_txt)
                # Try to extract the number
                current_q = line.strip().lower().replace(":", "").replace(" ", "")
                current_txt = []
            else:
                current_txt.append(line)
        if current_q:
            extracted_map[current_q] = " ".join(current_txt)
        
        # If nothing found, just use the first question for everything
        if not extracted_map:
             q_id = list(answer_key.keys())[0]
             extracted_map[q_id] = extracted_text

    results = eval_engine.batch_evaluate(extracted_map, answer_key)
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
