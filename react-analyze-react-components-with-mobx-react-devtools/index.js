import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import React from "react";
import ReactDOM from "react-dom";
import DevTools from 'mobx-react-devtools';

const appState = observable({
  count: 0
})
appState.increment = function () {
  this.count++;
}
appState.decrement = function () {
  this.count--;
  console.log('hoi')
}

@observer class Counter extends Component {
  render() {
    return (
      <div>
        <DevTools />
        Counter: {this.props.store.count} <br />
        <button onClick={this.handleInc}> + </button>
        <button onClick={this.handleDec}> - </button>
      </div>
    )
  }

  handleInc = () => {
    this.props.store.increment()
  }

  handleDec = () => {
    this.props.store.decrement()
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Counter store={appState} />, rootElement);
