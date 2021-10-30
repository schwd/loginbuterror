import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserCreate from "./components/UserCreate";
import SignIn from "./components/SignIn";
import Users from './components/Users';

export default function App() {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const getToken = localStorage.getItem("uid");
    if (getToken) {
      setToken(getToken);
    }
  }, []);

  if (!token) {
    return <SignIn />
  }

  return (
  <div>
    <Router>
      {token && (
        <Fragment>
          <Navbar/>
          <Switch>
            <Route exact path="/" component={Users}/>
            <Route exact path="/create" component={UserCreate} />
          </Switch>
        </Fragment>
      )}
    </Router>
  </div>

  );
}

