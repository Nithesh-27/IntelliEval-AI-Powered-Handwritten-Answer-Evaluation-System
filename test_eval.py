from backend.utils.evaluator import SemanticEvaluator
import json

def run_sample_evaluation():
    eval_engine = SemanticEvaluator()
    
    # Sample Answer Key
    with open('sample_answer_key.json', 'r') as f:
        answer_key = json.load(f)
    
    # Sample Extracted Text (Mocking a student's handwriting)
    extracted_text = "Photosynthesis is the way plants transform light into energy. It uses chlorophyll. \n The three states of matter are solid, liquid and gas."
    
    # Map extracted text to questions (Simplified for this test)
    extracted_map = {
        "q1": "Photosynthesis is the way plants transform light into energy. It uses chlorophyll.",
        "q2": "The three states of matter are solid, liquid and gas."
    }
    
    results = eval_engine.batch_evaluate(extracted_map, answer_key)
    
    print("\n--- SAMPLE EVALUATION OUTPUT ---")
    print(f"Total Score: {results['total_score']} / {results['total_max_marks']}")
    print(f"Percentage: {results['overall_percentage']}%")
    print("\nBreakdown:")
    for res in results['question_results']:
        print(f"\nQuestion: {res['question_id']}")
        print(f"Similarity: {res['similarity_score']}")
        print(f"Marks: {res['marks_obtained']} / {res['max_marks']}")
        print(f"Student: {res['extracted_text']}")
        print(f"Reference: {res['reference_answer']}")

if __name__ == "__main__":
    run_sample_evaluation()
