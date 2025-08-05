from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

model = SentenceTransformer('all-MiniLM-L6-v2')

class VectorStore:
    def __init__(self, dimension=384):
        self.index = faiss.IndexFlatL2(dimension)
        self.texts = []
        
    def add_texts(self, texts):
        """Add texts to the vector store and update the index."""
        embeddings = model.encode(texts)
        self.index.add(np.array(embeddings, dtype=np.float32))
        self.texts.extend(texts)
        
    def search(self, query, k=5):
        """Search for the top k most similar texts to the query."""
        query_embedding = model.encode([query]).astype('float32')
        distances, indices = self.index.search(query_embedding, k)
        results = []
        
        for index in indices[0]:
            if index >= 0 and index < len(self.texts):
                results.append(self.texts[index])        
        return results
    
def embed_texts(texts):
    """Embed a list of texts and return their embeddings."""
    return model.encode(texts, show_progress_bar=False)    

def build_faiss_index(embeddings):
    """Build a FAISS index from the embeddings."""
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)
    return index

vector_store = VectorStore()