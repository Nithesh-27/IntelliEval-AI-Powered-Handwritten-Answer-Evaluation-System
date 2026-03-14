// Particle Animation
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = 'rgba(64, 224, 208, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

// Initialization
window.addEventListener('resize', initCanvas);
initCanvas();
createParticles();
animateParticles();

// File Handling
const keyInput = document.getElementById('key-input');
const sheetInput = document.getElementById('sheet-input');
const keyDrop = document.getElementById('key-drop-zone');
const sheetDrop = document.getElementById('sheet-drop-zone');
const evaluateBtn = document.getElementById('evaluate-btn');

let selectedKey = null;
let selectedSheet = null;

// Drag and drop setup
[keyDrop, sheetDrop].forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('hover');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('hover'));
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('hover');
        const file = e.dataTransfer.files[0];
        if (zone === keyDrop) handleKeyFile(file);
        else handleSheetFile(file);
    });
    zone.addEventListener('click', () => {
        if (zone === keyDrop) keyInput.click();
        else sheetInput.click();
    });
});

keyInput.addEventListener('change', (e) => handleKeyFile(e.target.files[0]));
sheetInput.addEventListener('change', (e) => handleSheetFile(e.target.files[0]));

function handleKeyFile(file) {
    if (file) {
        selectedKey = file;
        document.getElementById('key-status').textContent = `✓ ${file.name}`;
        checkReady();
    }
}

function handleSheetFile(file) {
    if (file) {
        selectedSheet = file;
        document.getElementById('sheet-status').textContent = `✓ ${file.name}`;
        checkReady();
    }
}

function checkReady() {
    evaluateBtn.disabled = !(selectedKey && selectedSheet);
}

// Evaluation Logic
evaluateBtn.addEventListener('click', async () => {
    switchSection('loading-section');

    try {
        // 1. Upload Sheet and extract text
        const formData = new FormData();
        formData.append('file', selectedSheet);

        const uploadRes = await fetch('http://localhost:8000/upload', {
            method: 'POST',
            body: formData
        });

        const uploadData = await uploadRes.json();
        if (uploadData.error) throw new Error(uploadData.error);

        // 2. Read Answer Key
        const keyText = await selectedKey.text();

        // 3. Evaluate
        const evalFormData = new FormData();
        evalFormData.append('extracted_text', uploadData.extracted_text);
        evalFormData.append('answer_key_json', keyText);

        if (!evalRes.ok) {
            const errData = await evalRes.json();
            throw new Error(errData.detail || errData.error || 'Evaluation failed on server');
        }

        const results = await evalRes.json();
        displayResults(results);

    } catch (err) {
        console.error("Evaluation Error:", err);
        alert(`Evaluation Failed: ${err.message}`);
        switchSection('upload-section');
    }
});

function switchSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function displayResults(data) {
    if (!data || !data.question_results) {
        console.error("Invalid response data:", data);
        alert("Received invalid data from server.");
        switchSection('upload-section');
        return;
    }
    const dashboard = document.getElementById('results-dashboard');
    dashboard.innerHTML = '';

    // Scaling marks to 100 as requested
    document.getElementById('score-text').textContent = `${data.overall_percentage} / 100`;
    document.getElementById('percentage-text').textContent = `${data.overall_percentage}%`;

    data.question_results.forEach(res => {
        const card = document.createElement('div');
        card.className = 'result-item';
        card.innerHTML = `
            <div class="result-item-header">
                <span class="q-id">Question: ${res.question_id}</span>
                <span class="q-marks">${res.marks_obtained} / ${res.max_marks}</span>
            </div>
            <div class="text-comparison">
                <div class="extracted-box">
                    <span class="box-label">Student Answer</span>
                    <p>${res.extracted_text || 'No text extracted'}</p>
                </div>
                <div class="ref-box">
                    <span class="box-label">Reference Answer</span>
                    <p>${res.reference_answer}</p>
                </div>
            </div>
            <div class="similarity-meter">
                <div class="similarity-fill" style="width: 0%"></div>
            </div>
            <p style="font-size: 0.8rem; margin-top: 5px; color: var(--text-dim)">
                Semantic Similarity: ${Math.round(res.similarity_score * 100)}%
            </p>
        `;
        dashboard.appendChild(card);

        // Animate meter
        setTimeout(() => {
            card.querySelector('.similarity-fill').style.width = `${res.similarity_score * 100}%`;
        }, 100);
    });

    switchSection('results-section');
}

// PDF Generation
document.getElementById('download-pdf-btn').addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const element = document.getElementById('results-section');
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0f172a' });
    const imgData = canvas.toDataURL('image/png');

    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    doc.save('Evaluation_Report.pdf');
});

document.getElementById('retry-btn').addEventListener('click', () => {
    selectedKey = null;
    selectedSheet = null;
    document.getElementById('key-status').textContent = '';
    document.getElementById('sheet-status').textContent = '';
    evaluateBtn.disabled = true;
    switchSection('upload-section');
});
