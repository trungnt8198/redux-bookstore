const Redux = {
  createStore(reducer, initialState) {
    let currentState = reducer(initialState, { type: "@@redux/INIT" });
    let listeners = [];

    return {
      getState() {
        return currentState;
      },
      dispatch(action) {
        currentState = reducer(currentState, action);
        listeners.forEach((listener) => listener());
      },
      subscribe(listener) {
        if (typeof listener === "function") listeners.push(listener);
        return () => {
          listeners = listeners.filter((l) => l !== listener);
        };
      },
    };
  },
};

export default Redux;
