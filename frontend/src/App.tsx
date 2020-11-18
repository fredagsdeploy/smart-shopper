import React, { useEffect } from "react";
import { PersistGate } from "redux-persist/integration/react";
import "./App.css";
import { Provider, useDispatch } from "react-redux";
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
import { fetchItemGraph } from "./backend";
import { setGraph } from "./reducers/itemGraph";
import { log } from "util";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading</div>} persistor={persistor}>
        <AppRouter />
      </PersistGate>
    </Provider>
  );
}

const AppRouter = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    fetchItemGraph()
      .then((res) => {
        if (res.success) {
          console.log("Successfully got item graph", res);
          dispatch(setGraph(res.unwrap().value));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const navItems: NavItemProps[] = [
    { to: "/shoppingLists", title: "Shopping Lists" },
    { to: "/login", title: "Sign in", alignRight: true },
  ];

  return (
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
  );
};

export default App;
