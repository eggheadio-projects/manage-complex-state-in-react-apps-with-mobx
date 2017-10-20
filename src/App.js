import React, {Component} from 'react';

import {observable} from 'mobx';
import {observer} from 'mobx-react';
import  DevTools from 'mobx-react-devtools';


//let Devtools = DevTools.default;
export const appState = observable({
  count : 0
})
appState.increment = function() {
  this.count++;
}
appState.decrement = function() {
  this.count--;
}




@observer class Counter extends Component {
  render() {
    
    return (
      <div>
        <DevTools />
        Counter: {this.props.store.count} <br/>
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

export default Counter;