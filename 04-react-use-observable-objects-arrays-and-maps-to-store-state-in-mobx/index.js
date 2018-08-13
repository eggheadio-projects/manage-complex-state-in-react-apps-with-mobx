import {
  observable,
  computed,
  action
} from 'mobx';
import { observer } from 'mobx-react';
import React from "react";
import ReactDOM from "react-dom";
import DevTools from 'mobx-react-devtools';

class Temperature {
  @observable unit = "C";
  @observable temperatureCelsius = 25;

  @computed get temperatureKelvin() {
    console.log("calculating Kelvin");
    return this.temperatureCelsius * (9 / 5) + 32
  }

  @computed get temperatureFahrenheit() {
    console.log("calculating Fahrenheit");
    return this.temperatureCelsius + 273.15
  }

  @computed get temperature() {
    console.log("calculating temperature");
    switch (this.unit) {
      case "K": return this.temperatureKelvin + "ºK"
      case "F": return this.temperatureFahrenheit + "ºF"
      case "C": return this.temperatureCelsius + "ºC"
    }
  }

  @action setUnit(newUnit) {
    this.unit = newUnit;
  }

  @action setCelsius(degrees) {
    this.temperatureCelsius = degrees;
  }

  @action("update temperature and unit")
  setTemperatureAndUnit(degrees, unit) {
    this.setCelsius(degrees);
    this.setUnit(unit);
  }
}

/*
  asMap deprecated, use observable.map instead
  https://github.com/mobxjs/mobx-utils/issues/35
*/
const temps = observable.map({
  "Amsterdam": new Temperature(),
  "Rome": new Temperature()
});


const App = observer(({ temperature }) => (
  <div>
    {
      /*
        keys and values now return iterators, to return an array, use Array.from with the iterator
        https://github.com/mobxjs/mobx/issues/1488
      */
      Array.from(temperature.keys()).map(city => <div key={city}>{city}: {temperature.get(city).temperature}</div>)
    }
    <DevTools />
  </div>
))


const rootElement = document.getElementById("root");
ReactDOM.render(<App temperature={temps} />, rootElement);

global.temps = temps /* expose `temps` to the console */
global.Temperature = Temperature /* expose `Temperature` to the console */