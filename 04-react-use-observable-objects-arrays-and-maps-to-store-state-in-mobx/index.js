import {
  observable,
  computed,
  action,
  transaction,
  asMap
} from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
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

console.log(Temperature);

const temps = observable(asMap({
  "Amsterdam": new Temperature(),
  "Rome": new Temperature()
}));

const App = observer(({ temperature }) => (
  <div>
    {temperature.map(([city, t]) =>
      <div key={t.id}>{city}: {t.temperature}</div>
    )}
    <DevTools />
  </div>
))


const rootElement = document.getElementById("root");
ReactDOM.render(<App temperature={temps} />, rootElement);
