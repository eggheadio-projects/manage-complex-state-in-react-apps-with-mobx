import {
  observable,
  computed,
  action
} from "mobx";
import { observer } from "mobx-react";
import React from "react";
import DevTools from "mobx-react-devtools";
import ReactDOM from "react-dom";

class Temperature {
  id = Math.random();
  @observable unit = "C";
  @observable temperatureCelsius = 25;

  constructor(degrees, unit) {
    this.setTemperatureAndUnit(degrees, unit);
  }

  @computed
  get temperatureKelvin() {
    console.log("calculating Kelvin");
    return this.temperatureCelsius * (9 / 5) + 32;
  }

  @computed
  get temperatureFahrenheit() {
    console.log("calculating Fahrenheit");
    return this.temperatureCelsius + 273.15;
  }

  @computed
  get temperature() {
    console.log("calculating temperature");
    switch (this.unit) {
      case "K":
        return this.temperatureKelvin + "ºK";
      case "F":
        return this.temperatureFahrenheit + "ºF";
      case "C":
        return this.temperatureCelsius + "ºC";
    }
  }

  @action
  setUnit(newUnit) {
    this.unit = newUnit;
  }

  @action
  setCelsius(degrees) {
    this.temperatureCelsius = degrees;
  }

  @action
  setTemperatureAndUnit(degrees, unit) {
    this.setCelsius(degrees);
    this.setUnit(unit);
  }

  @action
  inc() {
    this.setCelsius(this.temperatureCelsius + 1);
  }
}

const temps = observable([]);
temps.push(new Temperature(20, "K"));
temps.push(new Temperature(25, "F"));
temps.push(new Temperature(20, "C"));

const App = observer(({ temperatures }) => (
  <ul>
    {temperatures.map(t => <TView key={t.id} temperature={t} />)}
    <DevTools />
  </ul>
));

@observer
class TView extends React.Component {
  render() {
    const t = this.props.temperature;
    return <li onClick={this.onTemperatureClick}>{t.temperature}</li>;
  }

  @action
  onTemperatureClick = () => {
    this.props.temperature.inc();
  };
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App temperatures={temps} />, rootElement);

global.temps = temps /* expose `temps` to the console */
global.Temperature = Temperature /* expose `Temperature` to the console */
