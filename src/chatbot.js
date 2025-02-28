import { db, collection, getDocs, addDoc, deleteDoc, doc, getDoc } from "./firebaseConfig";
import { GoogleGenerativeAI } from '@google/generative-ai';

// console.log("chatbot.js is working!"); 

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded");
    console.log("send-btn exists:", document.getElementById("send-btn"));
});


document.addEventListener("DOMContentLoaded", async function () {
    await getApiKey();

    document.getElementById("send-btn").addEventListener("click", async () => {
        let prompt = document.getElementById("chat-input").value.trim().toLowerCase();
        if (prompt) {
            console.log("User input:", prompt);
            if (!ruleChatBot(prompt)) {
                let response = await askChatBot(prompt);
                appendMessage("Bot: " + response);
            }
        } else {
            appendMessage("Please enter a prompt");
        }
    });
});

async function getApiKey() {
    try {
        let snapshot = await getDoc(doc(db, "apikey", "googlegenai"));
        apiKey = snapshot.data().key;
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } catch (error) {
        console.error("Error fetching API key:", error);
    }
}

async function askChatBot(request) {
    try {
        let response = await model.generateContent(request);
        console.log("Chatbot response:", response.text());
        return response.text();
    } catch (error) {
        console.error("Error from chatbot:", error);
        return "Sorry, I encountered an issue.";
    }
}

function ruleChatBot(request) {
    console.log("RuleChatBot received:", request);
    if (request.startsWith("add book")) {
        let bookDetails = request.replace("add book", "").trim();
        if (bookDetails) {
            addBookFromChat(bookDetails);
            appendMessage('Book "' + bookDetails + '" added!');
        } else {
            appendMessage("Please specify book details to add.");
        }
        return true;
    } else if (request.startsWith("delete book")) {
        let bookName = request.replace("delete book", "").trim();
        if (bookName) {
            if (removeBookByName(bookName)) {
                appendMessage('Book "' + bookName + '" removed.');
            } else {
                appendMessage("Book not found!");
            }
        } else {
            appendMessage("Please specify a book to delete.");
        }
        return true;
    }
    console.log("No matching rule found");
    return false;
}

function appendMessage(message) {
    console.log("Appending message:", message);
    let history = document.createElement("div");
    history.textContent = message;
    history.className = 'history';
    document.getElementById("chat-history").appendChild(history);
    document.getElementById("chat-input").value = "";
}

async function addBookFromChat(bookDetails) {
    try {
        const bookRef = collection(db, "books");
        await addDoc(bookRef, { title: bookDetails, author: "Unknown", genre: "General", rating: "N/A" });
        fetchBooks();
    } catch (error) {
        console.error("Error adding book:", error);
    }
}

async function removeBookByName(bookName) {
    try {
        const bookRef = collection(db, "books");
        const snapshot = await getDocs(bookRef);
        let found = false;
        snapshot.forEach(async (docItem) => {
            const book = docItem.data();
            if (book.title.toLowerCase() === bookName.toLowerCase()) {
                await deleteDoc(doc(db, "books", docItem.id));
                fetchBooks();
                found = true;
            }
        });
        return found;
    } catch (error) {
        console.error("Error deleting book:", error);
        return false;
    }
    
}

