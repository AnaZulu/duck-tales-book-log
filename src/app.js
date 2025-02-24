import { db, collection, getDocs, addDoc, deleteDoc, doc } from "./firebaseConfig";

const bookForm = document.getElementById("book-form");
const bookList = document.getElementById("book-list");

document.addEventListener("DOMContentLoaded", () => {
    fetchBooks();

    bookForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await addBook();
    });

    bookList.addEventListener("click", async (e) => {
        if (e.target && e.target.classList.contains("delete-btn")) {
            const bookId = e.target.getAttribute("data-id");
            await deleteBook(bookId);
        }
    });
});

const addBook = async () => {
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const genre = document.getElementById("genre").value.trim();
    const rating = document.getElementById("rating").value.trim();

    if (title && author && genre && rating) {
        try {
            const bookRef = collection(db, "books");
            await addDoc(bookRef, { title, author, genre, rating });
            alert("Book added successfully!");
            fetchBooks();
            bookForm.reset();
        } catch (error) {
            console.error("Error adding book:", error);
        }
    } else {
        alert("Please fill in all fields before adding a book.");
    }
};

const fetchBooks = async () => {
    bookList.innerHTML = "";
    try {
        const bookRef = collection(db, "books");
        const snapshot = await getDocs(bookRef);
        snapshot.forEach((doc) => {
            const book = doc.data();
            const bookItem = document.createElement("li");
            bookItem.innerHTML = `<strong>${book.title}</strong> by ${book.author} - ${book.genre} (Rating: ${book.rating}/5)
                <button class="delete-btn" data-id="${doc.id}">Remove</button>`;
            bookList.appendChild(bookItem);
        });
    } catch (error) {
        console.error("Error fetching books:", error);
    }
};

const deleteBook = async (id) => {
    try {
        const bookRef = doc(db, "books", id);
        await deleteDoc(bookRef);
        console.log(`Book with ID ${id} deleted`);
        fetchBooks();
    } catch (error) {
        console.error("Error deleting book:", error);
    }
};
