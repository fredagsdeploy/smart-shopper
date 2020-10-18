import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./reducers/store";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { SignIn } from "./SignIn";
import { ListPage } from "./ListPage";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/login">
            <SignIn />
          </Route>

          <Route path="/shoppingList">
            <ListPage />
          </Route>

          <Route path="/">
            <Redirect
              to={{
                pathname: "/login",
              }}
            />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
