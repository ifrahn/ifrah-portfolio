from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from main import ask_bot

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {"status": "ok"}


class ChatRequest(BaseModel):
    question: str = ""
    message: str = ""
    history: List[Dict[str, Any]] = []


@app.post("/chat")
def chat(req: ChatRequest):
    q = (req.question or req.message).strip()
    try:
        answer = ask_bot(q, history=req.history)
    except Exception as e:
        print("Chatbot error:", e)
        answer = f"Backend error: {e}"
    return {"answer": answer, "reply": answer}