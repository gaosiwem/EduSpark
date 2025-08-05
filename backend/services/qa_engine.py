from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")
index = faiss.IndexFlatL2(384)
knowledge_base = []

def load_video_knowledge(transcript: str, ocr_outputs: list):
    combined = transcript.split(". ") + ocr_outputs
    embeddings = model.encode(combined)
    index.add(np.array(embeddings))
    knowledge_base.extend(combined)
    

def query_context(question: str):
    query_vec = model.encode([question])
    _, indices = index.search(np.array(query_vec), k=3)
    return [knowledge_base[i] for i in indices[0] if i < len(knowledge_base)]