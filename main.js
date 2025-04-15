import {
  addBookAction,
  createStore,
  filterBookAction,
  removeBookAction,
  updateBookAction,
} from "./store.js";

const initState = {
  books: localStorage.getItem("books")
    ? JSON.parse(localStorage.getItem("books"))
    : [],
  filter: "",
};

const store = createStore(initState);

store.subscribe(() => {
  const state = store.getState();
  if (state.filter !== "") {
    const filteredBooks = state.books.filter((book) =>
      book.name.toLowerCase().includes(state.filter.toLowerCase())
    );
    renderBooks(filteredBooks);
    return;
  }
  localStorage.setItem("books", JSON.stringify(state.books));
  renderBooks(state.books);
});

const addBookForm = document.querySelector("#add-book");
const bookList = document.querySelector("#book-list");
const resultCount = document.querySelector("#result-count");
const filterInput = document.querySelector("#filter-input");

bookList.addEventListener("click", function (e) {
  if (e.target.classList.contains("update-btn")) {
    const id = e.target.dataset.id;
    const book = store.getState().books.find((b) => b.id == id);
    const newName = prompt("Vui lòng nhập tên mới của sách: ", book.name);
    if (newName !== null && newName !== book.name) {
      updateBook({ ...book, name: newName });
    }
  }

  if (e.target.classList.contains("remove-btn")) {
    const id = e.target.dataset.id;
    const confirmRemove = confirm("Bạn có chắc là muốn gỡ cuốn sách này ?");
    if (confirmRemove) {
      removeBook(id);
    }
  }
});

renderBooks(store.getState().books);

addBookForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const book = Object.fromEntries(new FormData(e.target));
  book.name = book.name.trim();
  if (book.name.length > 0) {
    book.id = getCurrentId();
    addBook(book);
    e.target.reset();
  }
});

function renderBooks(books) {
  if (books.length === 0) {
    bookList.innerHTML = `Không tìm thấy quyển sách nào !`;
    showResultCount(0);
    return;
  }
  bookList.innerHTML = "";
  books.forEach((book) => {
    addToBookList(book, bookList);
  });
  showResultCount(books.length);
}

function showResultCount(count) {
  resultCount.innerText = count > 0 ? "Số quyển sách tìm thấy: " + count : "";
}

function addBook(book) {
  store.dispatch(addBookAction(book));
  showMessage("Đã thêm sách");
}

function getCurrentId() {
  if (store.getState().books.length === 0) return 1;
  const currentId = store.getState().books.reduce((latestId, currentBook) => {
    return Math.max(currentBook.id, latestId);
  }, 1);
  return currentId + 1;
}

function removeBook(id) {
  store.dispatch(removeBookAction({ id }));
  showMessage("Đã xóa sách");
}

function updateBook(book) {
  store.dispatch(updateBookAction(book));
  showMessage("Đã cập nhật sách");
}

function addToBookList(book, bookList) {
  const li = document.createElement("li");
  li.className = "book";

  const h3 = document.createElement("h3");
  h3.innerText = book.name;
  h3.className = "book-name";

  li.appendChild(h3);
  li.innerHTML += `
    <div>
        <button class="update-btn" data-id=${book.id}>Cập nhật</button>
        <button class="remove-btn" data-id=${book.id}>Xóa</button>
    </div>`;
  bookList.appendChild(li);
}

function showMessage(message) {
  Toastify({
    text: message,
    duration: 1500,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
}

const handleFilterInput = debounce((bookName) => {
  store.dispatch(filterBookAction({ name: bookName }));
}, 600);

filterInput.addEventListener("input", (e) =>
  handleFilterInput(e.target.value.trim())
);

function debounce(func, delay) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
