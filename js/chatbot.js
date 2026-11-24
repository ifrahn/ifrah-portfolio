const chatbot = document.getElementById("chatbot");
const minimizeChat = document.getElementById("minimizeChat");
const openChat = document.getElementById("openChat");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

const chatHistory = [];

minimizeChat.addEventListener("click", () => {
    chatbot.classList.add("minimized");
    openChat.classList.remove("hidden");
});

openChat.addEventListener("click", () => {
    chatbot.classList.remove("minimized");
    openChat.classList.add("hidden");
});

chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const userQuestion = chatInput.value.trim();
    if (!userQuestion) return;

    const userMessage = document.createElement("div");
    userMessage.classList.add("user-message");
    userMessage.textContent = userQuestion;
    chatMessages.appendChild(userMessage);

    chatInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const loadingMessage = document.createElement("div");
    loadingMessage.classList.add("bot-message");
    loadingMessage.textContent = "Thinking...";
    chatMessages.appendChild(loadingMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch("http://127.0.0.1:8000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question: userQuestion,
                message: userQuestion,
                history: chatHistory
            })
        });

        if (!response.ok) throw new Error("Python API returned an error");

        const data = await response.json();
        const reply = data.answer || data.reply;
        loadingMessage.textContent = reply;

        chatHistory.push({ role: "user", text: userQuestion });
        chatHistory.push({ role: "assistant", text: reply });
        if (chatHistory.length > 10) chatHistory.splice(0, 2);
    } catch (error) {
        console.error(error);
        loadingMessage.textContent = "Could not reach the Python assistant on port 8000. Make sure uvicorn is running.";
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
});