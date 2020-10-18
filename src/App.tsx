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
import { ShoppingListsPage } from "./ShoppingListsPage";

function App() {
  return (
    <Provider store={store}>
      <main>
        <Router>
          <Switch>
            <Route path="/login">
              <SignIn />
            </Route>

            <Route path="/shoppingLists/:shoppingListId">
              <ListPage />
            </Route>

            <Route path="/shoppingLists">
              <ShoppingListsPage />
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
      </main>
    </Provider>
  );
}

export default App;
