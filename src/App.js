import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { history } from "./config/history";
import LinkedListLayout from './componentsLayout/LinkedListLayout';
import HomeLayout from './componentsLayout/HomeLayout';
import DoubleLinkedListLayout from './componentsLayout/DoubleLinkedListLayout';
import AboutLayout from './componentsLayout/AboutLayout';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPath: window.location.pathname,
      menuItems: [{path: "/linkedList", name: "Linked List"}, {path: "/doubleLinkedList", name: "Double Linked List"}, {path: "/about", name: "Sobre"}]
    };
  }

  changePath(path) {
    this.setState({currentPath: path}, () => history.push(path));
  };

  isCurrentPath(path) {
    return this.state.currentPath === path;
  };

  render() {
    return (
      <Router history={history}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <li className="navbar-brand click" onClick={this.changePath.bind(this, "/")}><img src="logo192.png" width="30" height="30" className="d-inline-block align-top" alt=""/> VisuED</li>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                {this.state.menuItems.map((elem, index) => 
                  <li key={index} className={this.isCurrentPath(elem.path) ? "nav-item nav-link click active":"nav-item nav-link click"} onClick={this.changePath.bind(this, elem.path)}>{elem.name}</li>
                )}
              </div>
            </div>
          </nav>
        <div className="container-fluid mt-5">
          <Switch>
            <Route exact path="/" render={(props) => <HomeLayout {...props} changePath={this.changePath.bind(this)} />}/>
            <Route exact path="/linkedList" component={LinkedListLayout} />
            <Route exact path="/doubleLinkedList" component={DoubleLinkedListLayout} />
            <Route exact path="/about" component={AboutLayout} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
