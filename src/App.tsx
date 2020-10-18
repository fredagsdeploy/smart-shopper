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
import { Nav, NavItemProps } from "./components/Nav";

function App() {
  const navItems: NavItemProps[] = [
    {to: "/shoppingLists", title: "Shopping Lists"},
    {to: "/login", title: "Sign in", alignRight: true},
  ];

  return (
    <Provider store={store}>
        <Router>
          <Nav navItems={navItems} />
          <main>
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
          </main>
        </Router>
    </Provider>
  );
}

export default App;
