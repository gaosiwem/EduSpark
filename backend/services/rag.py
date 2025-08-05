from services.embedding import embed_texts
from services.llm_client import generate_answer
import faiss

index = faiss.read_index("faiss.index")
transcript_chunks = [
    "Welcome to the tutorial on data structures.",
    "In this video, we will cover arrays, linked lists, and trees.",
    "Let's start with arrays, which are a collection of elements stored at contiguous memory locations.",
    "Arrays are used to store multiple items of the same type together."]


def query_knowledge_base(question: str) -> str:
    
    """Query the knowledge base and return the top k results."""
    
    # Embed the query
    query_embedding = embed_texts([question])[0].reshape(1, -1)
    
    # Search the FAISS index
    distances, indices = index.search(query_embedding, k=3)
    
    context = "\n".join(transcript_chunks[i] for i in indices[0])
    prompt =f"Answer the question based on the context:\n {context}\nQuestion: {question}"
    
    # Generate an answer using the LLM
    answer = generate_answer(prompt)
    
    return answer