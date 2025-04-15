import Redux from "./redux.js";

const ADD_BOOK = "ADD_BOOK";
const UPDATE_BOOK = "UPDATE_BOOK";
const REMOVE_BOOK = "REMOVE_BOOK";
const SET_FILTER = "SET_FILTER";

const createAction = (type, payload) => {
  return { type, payload };
};

export const addBookAction = (book) => createAction(ADD_BOOK, book);
export const updateBookAction = (book) => createAction(UPDATE_BOOK, book);
export const removeBookAction = (book) => createAction(REMOVE_BOOK, book);
export const filterBookAction = (book) => createAction(SET_FILTER, book);

const reducer = (prevState, { type, payload }) => {
  switch (type) {
    case ADD_BOOK: {
      return { ...prevState, books: [payload, ...prevState.books] };
    }
    case UPDATE_BOOK: {
      return {
        ...prevState,
        books: prevState.books.map((book) =>
          book.id == payload.id ? { ...book, ...payload } : book
        ),
      };
    }
    case REMOVE_BOOK: {
      return {
        ...prevState,
        books: prevState.books.filter((book) => book.id != payload.id),
      };
    }
    case SET_FILTER: {
      return {
        ...prevState,
        filter: payload.name,
      };
    }
    default:
      return prevState;
  }
};

export const createStore = (initState) => {
  return Redux.createStore(reducer, initState);
};
