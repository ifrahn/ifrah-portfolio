from pathlib import Path
import os
import time
import numpy as np
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

KNOWLEDGE_FOLDERS = [Path("knowledge"), Path("server/data")]
CHAT_MODELS = [
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
    "gemini-3-flash-preview",
    "gemini-2.5-flash-lite",
]


def load_documents():
    documents = []
    seen_names = set()

    for folder in KNOWLEDGE_FOLDERS:
        if not folder.exists():
            continue
        for ext in ("*.md", "*.txt"):
            for file_path in folder.glob(ext):
                if file_path.name in seen_names:
                    continue
                seen_names.add(file_path.name)
                content = file_path.read_text(encoding="utf-8")
                if content.strip():
                    documents.append({
                        "source": file_path.name,
                        "content": content
                    })

    return documents


def chunk_documents(documents, chunk_size=1000):
    chunks = []

    for document in documents:
        paragraphs = document["content"].split("\n\n")
        current_chunk = ""

        for paragraph in paragraphs:
            paragraph = paragraph.strip()
            if not paragraph:
                continue

            if len(current_chunk) + len(paragraph) > chunk_size:
                if current_chunk:
                    chunks.append({
                        "source": document["source"],
                        "content": current_chunk.strip()
                    })
                current_chunk = paragraph
            else:
                current_chunk += "\n\n" + paragraph

        if current_chunk:
            chunks.append({
                "source": document["source"],
                "content": current_chunk.strip()
            })

    return chunks


def generate_embedding(text):
    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text
    )
    return response.embeddings[0].values


def cosine_similarity(vector_a, vector_b):
    vector_a = np.array(vector_a)
    vector_b = np.array(vector_b)
    return np.dot(vector_a, vector_b) / (
        np.linalg.norm(vector_a) * np.linalg.norm(vector_b)
    )


def retrieve_chunks(question, chunks, top_k=4):
    if not chunks:
        return []

    question_embedding = generate_embedding(question)
    similarities = []

    for chunk in chunks:
        score = cosine_similarity(question_embedding, chunk["embedding"])
        similarities.append({
            "source": chunk["source"],
            "content": chunk["content"],
            "score": score
        })

    similarities.sort(key=lambda item: item["score"], reverse=True)
    return similarities[:top_k]


def _local_cv_fallback(retrieved_chunks):
    if not retrieved_chunks:
        return "You can reach me directly at nifrah590@gmail.com and I'll be happy to share more details!"
    top_text = retrieved_chunks[0]["content"].strip()
    return f"Here is what I have on that:\n\n{top_text}"


def format_history(history):
    if not history:
        return "None yet."
    lines = []
    for turn in history[-6:]:
        role = "Visitor" if turn.get("role") == "user" else "Ifrah"
        text = str(turn.get("text", "")).strip()
        if text:
            lines.append(f"{role}: {text}")
    return "\n".join(lines) if lines else "None yet."


def generate_answer(question, retrieved_chunks, full_context="", history=None):
    matched_sections = "\n".join(
        f"[{c['source']}]\n{c['content']}" for c in retrieved_chunks
    )
    recent_chat = format_history(history)

    prompt = f"""
You are Ifrah Naeem — a sharp, creative Game Developer and 3D Artist from Karachi chatting directly with a visitor on your portfolio website.

HOW TO THINK & RESPOND:
- Speak naturally in first person ("I", "my", "me") with genuine personality — confident, warm, witty, and concise.
- SYNTHESIZE AND PARAPHRASE. Never copy-paste sentences or dump raw bulleted lists verbatim from your CV notes.
- Match your depth to the question:
  * If asked a broad question (e.g., "what games have you made?"), give a punchy, engaging overview in 3–4 conversational sentences highlighting your standout titles (like *Masketeer* winning 2nd place at Global Game Jam Karachi, *The Seeds* in Unreal Engine where you modeled the robot enemy on this very page in Blender, and *Veil of Secrets* in Unity), then ask which one they'd like to hear more about.
  * If asked a specific or technical question (e.g., AI, mechanics, Blender workflow, education, awards), dive straight into the exact details clearly and thoughtfully.
- Connect the dots across your background naturally (for example, how your C++ OOP foundation led into Unity C# and Unreal Engine Blueprints).
- Use the recent conversation history so follow-up questions ("tell me more about that one", "what engine was it built in?") make total sense.
- Strictly stick to facts supported by your CV/notes below — never invent projects, dates, or grades. If something isn't in your notes, say so casually and offer your email (nifrah590@gmail.com).
- Do NOT tack your email onto the end of every message unless the visitor asks how to contact you or asks something not covered in your CV.
- Never refer to yourself as an AI, bot, or assistant. Always finish your thought cleanly.

YOUR CV & PORTFOLIO KNOWLEDGE:
{full_context}

MOST RELEVANT SECTIONS FOR THIS QUESTION:
{matched_sections}

RECENT CONVERSATION:
{recent_chat}

VISITOR'S LATEST MESSAGE:
{question}

Reply naturally as Ifrah:
"""

    for model_name in CHAT_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config={
                    "temperature": 0.65,
                    "max_output_tokens": 700,
                }
            )
            if response and response.text:
                return response.text.strip()
        except Exception as err:
            err_str = str(err)
            print(f"Model {model_name} failed ({err_str}), trying next fallback...")
            if any(code in err_str for code in ("503", "429", "UNAVAILABLE", "RESOURCE_EXHAUSTED")):
                time.sleep(0.5)
            continue

    return _local_cv_fallback(retrieved_chunks)


_CACHED_DOCS = None
_CACHED_CHUNKS = None


def get_index():
    global _CACHED_DOCS, _CACHED_CHUNKS
    if _CACHED_CHUNKS is None:
        docs = load_documents()
        _CACHED_DOCS = "\n\n".join(
            f"=== {d['source']} ===\n{d['content']}" for d in docs
        )[:30000]
        chunks = chunk_documents(docs)
        for chunk in chunks:
            chunk["embedding"] = generate_embedding(chunk["content"])
        _CACHED_CHUNKS = chunks
    return _CACHED_DOCS, _CACHED_CHUNKS


def ask_bot(question: str, history=None) -> str:
    full_context, chunks = get_index()
    if not chunks:
        return "My CV notes haven't been loaded yet. Please add your CV inside knowledge/knowledge.md."
    results = retrieve_chunks(question, chunks)
    return generate_answer(question, results, full_context, history=history)


if __name__ == "__main__":
    print(ask_bot("What games have you made?"))