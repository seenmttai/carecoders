from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import io
import base64
import torch
from transformers import ViTForImageClassification, ViTFeatureExtractor
from PIL import Image
import PyPDF2
from sentence_transformers import SentenceTransformer, util
import google.generativeai as genai
import traceback

app = Flask(__name__)
CORS(app)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

brain_idx_to_class = {0: 'glioma', 1: 'healthy', 2: 'meningioma', 3: 'pituitary'}
feature_extractor = ViTFeatureExtractor.from_pretrained('google/vit-base-patch16-224-in21k')
brain_model = ViTForImageClassification.from_pretrained('google/vit-base-patch16-224-in21k', num_labels=4)
brain_model_path = r"C:\Users\bhans\Downloads\vit_brain_tumor_classifier.pth"  
brain_model.load_state_dict(torch.load(brain_model_path, map_location=device))
brain_model.to(device)
brain_model.eval()

reports_brain = {
    "glioma": {
        "medical": ("Gliomas are primary central nervous system neoplasms originating from glial cells, "
                    "characterized by infiltrative growth, cellular heterogeneity, and variable response to adjuvant therapies. "
                    "They often present with peritumoral edema, mass effect, and disruption of normal parenchymal architecture."),
        "layman": ("A glioma is a type of brain tumor that starts in the supportive cells of the brain. "
                   "It tends to grow in a way that makes it difficult to remove completely and can cause swelling and pressure on nearby brain areas.")
    },
    "meningioma": {
        "medical": ("Meningiomas are typically benign tumors that arise from the meninges, the protective membranes covering the brain and spinal cord. "
                    "They generally exhibit slow growth but can cause compression of adjacent neural structures, leading to focal neurological deficits."),
        "layman": ("A meningioma is usually a non-cancerous tumor that forms on the layers covering the brain. "
                   "It grows slowly but may press on nearby brain tissue, sometimes causing headaches or seizures.")
    },
    "pituitary": {
        "medical": ("Pituitary adenomas are neoplasms arising from the anterior pituitary gland. "
                    "Depending on their secretory status, they can disrupt endocrine function and exert mass effect on the surrounding brain tissue."),
        "layman": ("A pituitary tumor is a growth in the small gland at the base of your brain. "
                   "It can affect hormone levels and, by pressing on nearby structures, may lead to various symptoms.")
    },
    "healthy": {
        "medical": ("No abnormal neoplastic process is identified within the brain parenchyma. "
                    "The imaging findings are consistent with a structurally and functionally normal brain."),
        "layman": ("The scan shows no signs of a tumor or any abnormal growth in the brain. Everything appears normal.")
    }
}

skin_idx_to_class = {0: "Bengin cases", 1: "Malignant cases", 2: "Normal cases"}
skin_model = ViTForImageClassification.from_pretrained('google/vit-base-patch16-224-in21k', num_labels=3)
skin_model_path = r"C:\Users\bhans\Downloads\vit_lungcancer_classifier_final.pth"  
skin_model.load_state_dict(torch.load(skin_model_path, map_location=device))
skin_model.to(device)
skin_model.eval()

reports_skin = {
    "Bengin cases": {
        "medical": "The lesion is classified as benign. No malignant features were detected.",
        "layman": "The skin lesion appears non-cancerous."
    },
    "Malignant cases": {
        "medical": "The lesion shows features associated with malignant skin cancer. Clinical correlation is advised.",
        "layman": "The skin lesion appears malignant. Please consult a doctor immediately."
    },
    "Normal cases": {
        "medical": "The imaging findings are consistent with normal skin without cancerous changes.",
        "layman": "No signs of skin cancer were detected."
    }
}

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
documents_path = "documents"  
document_texts = {}
document_embeddings = []

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"Error reading {pdf_path}: {str(e)}")
    return text.strip()

if os.path.exists(documents_path):
    for file_name in os.listdir(documents_path):
        if file_name.lower().endswith(".pdf"):
            file_path = os.path.join(documents_path, file_name)
            text = extract_text_from_pdf(file_path)
            if text:
                document_texts[file_name] = text
                embedding = embedding_model.encode(text, convert_to_tensor=True)
                document_embeddings.append(embedding)
    if document_embeddings:
        document_embeddings = torch.stack(document_embeddings)
    else:
        document_embeddings = None
else:
    print(f"Documents folder '{documents_path}' does not exist.")

def get_top_documents(query, top_k=3):
    if document_embeddings is None:
        return []
    query_embedding = embedding_model.encode(query, convert_to_tensor=True)
    similarity_scores = util.pytorch_cos_sim(query_embedding, document_embeddings)[0]
    top_results = torch.topk(similarity_scores, min(top_k, len(similarity_scores)))
    top_docs = []
    file_names = list(document_texts.keys())
    for idx in top_results.indices:
        top_docs.append(document_texts[file_names[idx]])
    return top_docs

disease_facts_db = {
    "glioma": ["Gliomas are often aggressive.", "They may require multimodal treatment."],
    "meningioma": ["Meningiomas are usually benign.", "Surgical removal is common."],
    "pituitary": ["Pituitary tumors can affect hormones.", "They sometimes require medication or surgery."],
    "healthy": ["No abnormalities detected in the brain."],
    "Bengin cases": ["Benign skin lesions rarely progress to cancer.", "Regular monitoring is recommended."],
    "Malignant cases": ["Malignant lesions require prompt medical attention.", "Early diagnosis improves outcomes."],
    "Normal cases": ["Skin appears normal with no signs of cancer."]
}

@app.route('/api/disease-facts', methods=['GET'])
def disease_facts():
    disease = request.args.get('disease')
    facts = disease_facts_db.get(disease, ["No facts available for this disease."])
    return jsonify({"facts": facts})

def sliding_window_search(image, window_size, step_size, target_class_index):
    best_prob = -1
    best_box = None
    image_width, image_height = image.size
    for left in range(0, image_width - window_size + 1, step_size):
        for top in range(0, image_height - window_size + 1, step_size):
            right = left + window_size
            bottom = top + window_size
            crop = image.crop((left, top, right, bottom))
            inputs_crop = feature_extractor(images=crop, return_tensors="pt")
            inputs_crop = {k: v.to(device) for k, v in inputs_crop.items()}
            with torch.no_grad():
                outputs_crop = brain_model(pixel_values=inputs_crop['pixel_values'])
            logits_crop = outputs_crop.logits
            probs_crop = torch.nn.functional.softmax(logits_crop, dim=1)[0]
            prob_target = probs_crop[target_class_index].item()
            if prob_target > best_prob:
                best_prob = prob_target
                best_box = (left, top, right, bottom)
    return best_box, best_prob

def refined_search(image, base_box, search_margin, refined_window_size, refined_step_size, target_class_index):
    left, top, right, bottom = base_box
    image_width, image_height = image.size
    refined_left = max(0, left - search_margin)
    refined_top = max(0, top - search_margin)
    refined_right = min(image_width, right + search_margin)
    refined_bottom = min(image_height, bottom + search_margin)

    best_prob = -1
    best_box = None
    for l in range(refined_left, max(refined_left, refined_right - refined_window_size + 1), refined_step_size):
        for t in range(refined_top, max(refined_top, refined_bottom - refined_window_size + 1), refined_step_size):
            r = l + refined_window_size
            b = t + refined_window_size
            crop = image.crop((l, t, r, b))
            inputs_crop = feature_extractor(images=crop, return_tensors="pt")
            inputs_crop = {k: v.to(device) for k, v in inputs_crop.items()}
            with torch.no_grad():
                outputs_crop = brain_model(pixel_values=inputs_crop['pixel_values'])
            logits_crop = outputs_crop.logits
            probs_crop = torch.nn.functional.softmax(logits_crop, dim=1)[0]
            prob_target = probs_crop[target_class_index].item()
            if prob_target > best_prob:
                best_prob = prob_target
                best_box = (l, t, r, b)
    return best_box, best_prob

def further_refined_search(image, base_box, target_class_index):
    left, top, right, bottom = base_box
    region_width = right - left
    region_height = bottom - top
    window_size = int(min(region_width, region_height) * 0.25)
    if window_size < 32:
        window_size = 32
    step_size = max(1, window_size // 2)

    best_prob = -1
    best_box = None
    for l in range(left, right - window_size + 1, step_size):
        for t in range(top, bottom - window_size + 1, step_size):
            r = l + window_size
            b = t + window_size
            crop = image.crop((l, t, r, b))
            inputs_crop = feature_extractor(images=crop, return_tensors="pt")
            inputs_crop = {k: v.to(device) for k, v in inputs_crop.items()}
            with torch.no_grad():
                outputs_crop = brain_model(pixel_values=inputs_crop['pixel_values'])
            logits_crop = outputs_crop.logits
            probs_crop = torch.nn.functional.softmax(logits_crop, dim=1)[0]
            prob_target = probs_crop[target_class_index].item()
            if prob_target > best_prob:
                best_prob = prob_target
                best_box = (l, t, r, b)
    return best_box, best_prob

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "models": ["ViT Brain Tumor Classifier", "ViT Skin Cancer Classifier"]
    })

@app.route('/predict', methods=['POST'])
def predict():

    if 'file' in request.files:
        image_file = request.files['file']
        try:
            image = Image.open(image_file).convert("RGB")
        except Exception as e:
            return jsonify({"error": f"Invalid image file: {str(e)}"}), 400
    else:
        try:
            data = request.get_json(force=True)
            if 'file' in data:
                image_data = base64.b64decode(data['file'])
                image = Image.open(io.BytesIO(image_data)).convert("RGB")
            else:
                return jsonify({"error": "No image provided"}), 400
        except Exception as e:
            return jsonify({"error": "Unsupported Media Type or invalid JSON"}), 415

    inputs = feature_extractor(images=image, return_tensors="pt")
    inputs = {key: value.to(device) for key, value in inputs.items()}
    with torch.no_grad():
        outputs = brain_model(pixel_values=inputs['pixel_values'])
    logits = outputs.logits
    predicted_class_idx = torch.argmax(logits, dim=1).item()
    predicted_class = brain_idx_to_class[predicted_class_idx]
    probabilities = torch.nn.functional.softmax(logits, dim=1)[0].tolist()
    confidence_scores = {brain_idx_to_class[i]: round(prob * 100, 2) for i, prob in enumerate(probabilities)}
    report = reports_brain.get(predicted_class, {"medical": "", "layman": ""})

    bounding_box = None
    localization_percentage = None
    if predicted_class != "healthy":
        window_size = 224
        step_size = 112
        base_box, base_prob = sliding_window_search(image, window_size, step_size, predicted_class_idx)
        refined_box, refined_prob = (None, -1)
        if base_box is not None:
            search_margin = 30
            refined_window_size = 112
            refined_step_size = 56
            refined_box, refined_prob = refined_search(image, base_box, search_margin, refined_window_size, refined_step_size, predicted_class_idx)
        third_box, third_prob = (None, -1)
        if refined_box is not None:
            third_box, third_prob = further_refined_search(image, refined_box, predicted_class_idx)
        if third_box is not None and third_prob > refined_prob:
            bounding_box = third_box
            localization_percentage = round(third_prob * 100, 2)
        elif refined_box is not None:
            bounding_box = refined_box
            localization_percentage = round(refined_prob * 100, 2)
        else:
            bounding_box = base_box
            localization_percentage = round(base_prob * 100, 2)

    response = {
        "prediction": predicted_class,
        "confidence_scores": confidence_scores,
        "is_tumor": predicted_class != "healthy",
        "report": {
            "medical": report["medical"],
            "layman": report["layman"]
        }
    }
    if bounding_box is not None:
        response["localization"] = {
            "bounding_box": {
                "left": bounding_box[0],
                "top": bounding_box[1],
                "right": bounding_box[2],
                "bottom": bounding_box[3]
            },
            "percentage": localization_percentage
        }
    return jsonify(response)

@app.route('/api/skincancer', methods=['POST'])
def predict_skincancer():
    try:

        if 'file' in request.files:
            image_file = request.files['file']
            try:
                image = Image.open(image_file).convert("RGB")
            except Exception as e:
                return jsonify({"error": f"Invalid image file: {str(e)}"}), 400
        else:
            data = request.get_json(force=True)
            if 'file' in data:
                try:
                    image_data = base64.b64decode(data['file'])
                    image = Image.open(io.BytesIO(image_data)).convert("RGB")
                except Exception as e:
                    return jsonify({"error": f"Error decoding base64 image: {str(e)}"}), 400
            else:
                return jsonify({"error": "No image provided"}), 400

        inputs = feature_extractor(images=image, return_tensors="pt")
        inputs = {key: value.to(device) for key, value in inputs.items()}

        with torch.no_grad():
            outputs = skin_model(pixel_values=inputs['pixel_values'])

        print("Skin model logits:", outputs.logits)

        logits = outputs.logits
        predicted_class_idx = torch.argmax(logits, dim=1).item()
        print("Predicted skin cancer class index:", predicted_class_idx)

        predicted_class = skin_idx_to_class.get(predicted_class_idx, "Unknown")
        probabilities = torch.nn.functional.softmax(logits, dim=1)[0].tolist()
        confidence_scores = {skin_idx_to_class[i]: round(prob * 100, 2) for i, prob in enumerate(probabilities)}
        report = reports_skin.get(predicted_class, {"medical": "", "layman": ""})

        response = {
            "prediction": predicted_class,
            "confidence_scores": confidence_scores,
            "report": {
                "medical": report["medical"],
                "layman": report["layman"]
            }
        }
        return jsonify(response)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json(force=True)
        query = data.get('query')
        if not query:
            return jsonify({"error": "No query provided"}), 400

        retrieved_contexts = get_top_documents(query, top_k=3)
        context_text = " ".join(retrieved_contexts) if retrieved_contexts else "No relevant documents found."
        prompt = f"Context: {context_text}\n\nQuestion: {query}\nAnswer:"

        try:
            genai.configure(api_key="AIzaSyBKVhMA27TLU1ixPQdnqz56n1dEFH-GQOk")
            generation_config = {
                "temperature": 1.0,
                "top_p": 0.95,
                "top_k": 64,
                "max_output_tokens": 8192,
                "response_mime_type": "text/plain",
            }
            model_instance = genai.GenerativeModel(
                model_name="gemini-2.0-flash",
                generation_config=generation_config,
            )
            history = [{"role": "user", "parts": [prompt]}]
            chat_session = model_instance.start_chat(history=history)
            response = chat_session.send_message(prompt)
            answer = response.text
        except Exception as inner_e:
            print("Error during Gemini API call:")
            traceback.print_exc()
            return jsonify({"error": f"Error generating response: {str(inner_e)}"}), 500

        return jsonify({"response": answer})
    except Exception as outer_e:
        print("Error in /api/chat endpoint:")
        traceback.print_exc()
        return jsonify({"error": f"Internal server error: {str(outer_e)}"}), 500

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)