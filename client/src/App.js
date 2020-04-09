import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import PrivateRoute from "./components/common/PrivateRoute";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";

import store from "./store";
import "./App.css";

if (localStorage.jwt_token) {
  setAuthToken(localStorage.jwt_token);

  const decoded = jwt_decode(localStorage.jwt_token);
  store.dispatch(setCurrentUser(decoded));

  const now = Date.now / 1000;
  if (localStorage.jwt_token.exp < now) {
    store.dispatch(logoutUser());

    window.location.href("/login");
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/login" component={Login}></Route>
              <Route exact path="/register" component={Register}></Route>
              <Switch>
                <PrivateRoute
                  exact
                  path="/dashboard"
                  component={Dashboard}
                ></PrivateRoute>
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
