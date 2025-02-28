import { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "./firebaseConfig";

const form = document.getElementById("book-form");
let editBookId = null; 

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const genre = document.getElementById("genre").value;
  const rating = parseInt(document.getElementById("rating").value, 10);

  try {
    if (editBookId) {
      
      const bookRef = doc(db, "books", editBookId);
      await updateDoc(bookRef, { title, author, genre, rating });
      editBookId = null;
    } else {
      
      await addDoc(collection(db, "books"), { title, author, genre, rating });
    }

    form.reset();
    fetchBooks(); 
  } catch (error) {
    console.error("Error saving book: ", error);
  }
});

function addBookToList(title, author, genre, rating, id) {
  const bookList = document.getElementById("book-list");
  const listItem = document.createElement("li");

  listItem.innerHTML = `
    <strong>${title}</strong> by ${author} (${genre}) - Rating: ${rating}/5
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
  `;

  const editButton = listItem.querySelector(".edit-btn");
  const deleteButton = listItem.querySelector(".delete-btn");

  editButton.addEventListener("click", () => editBook(id, title, author, genre, rating));
  deleteButton.addEventListener("click", () => deleteBook(id, listItem));

  bookList.appendChild(listItem);
}

async function fetchBooks() {
  try {
    const querySnapshot = await getDocs(collection(db, "books"));
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const book = doc.data();
      const { title, author, genre, rating } = book;
      const bookId = doc.id;
      addBookToList(title, author, genre, rating, bookId);
    });
  } catch (error) {
    console.error("Error retrieving books: ", error);
  }
}

async function deleteBook(bookId, listItem) {
  try {
    await deleteDoc(doc(db, "books", bookId));
    listItem.remove();
  } catch (error) {
    console.error("Error deleting book: ", error);
  }
}

function editBook(bookId, title, author, genre, rating) {
  document.getElementById("title").value = title;
  document.getElementById("author").value = author;
  document.getElementById("genre").value = genre;
  document.getElementById("rating").value = rating;
  editBookId = bookId; 
}

fetchBooks();
