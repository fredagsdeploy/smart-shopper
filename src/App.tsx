import React from "react";
import "./App.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./reducers/store";

import { ListPage } from "./ListPage";

function App() {
  return (
    <Provider store={store}>
      <ListPage />
    </Provider>
  );
}

export default App;
