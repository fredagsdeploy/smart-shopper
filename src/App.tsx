import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import "./App.css";
import { Provider } from "react-redux";
import { persistor, store } from "./reducers/store";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { SignIn } from "./SignIn";
import { ListPage } from "./ListPage";
import { ShoppingListsPage } from "./ShoppingListsPage";
import { Nav, NavItemProps } from "./components/Nav";
import { Footer } from "./Footer";

function App() {
  const navItems: NavItemProps[] = [
    { to: "/shoppingLists", title: "Shopping Lists" },
    { to: "/login", title: "Sign in", alignRight: true },
  ];

  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading</div>} persistor={persistor}>
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
          <Footer />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
