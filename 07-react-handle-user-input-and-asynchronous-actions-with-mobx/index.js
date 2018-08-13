// noprotect
import {
  observable,
  computed,
  action,
} from "mobx";
import { observer, Provider, inject } from "mobx-react";
import React from "react";
import ReactDOM from "react-dom";
import DevTools from "mobx-react-devtools";

const APPID = "6c9bb64443d124019b41ea00de26732e";

class Temperature {
  id = Math.random();
  @observable unit = "C";
  @observable temperatureCelsius = 25;
  @observable location = "Amsterdam, NL";
  @observable loading = true;

  constructor(location) {
    this.location = location;
    this.fetch();
  }

  @action
  fetch() {
    window
      .fetch(
        `https://api.openweathermap.org/data/2.5/weather?appid=${APPID}&q=${
        this.location
        }`
      )
      .then(res =>
        res.json().then(
          action(json => {
            this.temperatureCelsius = json.main.temp - 273.15;
            this.loading = false;
          })
        )
    ).catch(function (error) {
      console.log("This city is not in this api, try again.")
    });
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

  @action("update temperature and unit")
  setTemperatureAndUnit(degrees, unit) {
    this.setCelsius(degrees);
    this.setUnit(unit);
  }

  @action
  inc() {
    this.setCelsius(this.temperatureCelsius + 1);
  }
}

const App = inject("temperatures")(observer(({ temperatures }) => (
  <ul>
    <TemperatureInput />
    {temperatures.map(t => <TView key={t.id} temperature={t} />)}
    <DevTools />
  </ul>
)));

@inject("temperatures")
@observer
class TemperatureInput extends React.Component {
  @observable input = "";

  render() {
    return (
      <li>
        Destination
        <input onChange={this.onChange} value={this.input} />
        <button onClick={this.onSubmit}>Add</button>
      </li>
    );
  }

  @action
  onChange = e => {
    this.input = e.target.value;
  };

  @action
  onSubmit = () => {
    this.props.temperatures.push(new Temperature(this.input));
    this.input = "";
  };
}

@observer
class TView extends React.Component {
  render() {
    const t = this.props.temperature;
    return (
      <li onClick={this.onTemperatureClick}>
        {t.location}:
        {t.loading ? "loading.." : t.temperature}
      </li>
    );
  }

  @action
  onTemperatureClick = () => {
    this.props.temperature.inc();
  };
}

/// index file
const temps = observable([]);

ReactDOM.render(
  <Provider temperatures={temps}>
    <App />
  </Provider>,
  document.getElementById("app")
);
