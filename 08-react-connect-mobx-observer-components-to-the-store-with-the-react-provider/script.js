// noprotect
const {observable, computed, action, transaction, useStrict, extendObservable, asMap, when, autorun} = mobx;
const {observer, Provider} = mobxReact;
const {Component} = React;
const DevTools = mobxDevtools.default;

const APPID = "6c9bb64443d124019b41ea00de26732e"

class Temperature {
  id = Math.random();
  @observable unit = "C";
  @observable temperatureCelsius = 25;
  @observable location = "Amsterdam, NL";
  @observable loading = true;

  constructor(location) {
    this.location = location
    this.fetch()
  }

  @action fetch() {
     window.fetch(`https://api.openweathermap.org/data/2.5/weather?appid=${APPID}&q=${this.location}`)
    .then(res => res.json()
    .then(action(json => {
      this.temperatureCelsius = json.main.temp -273.15
      this.loading = false
    })))
  }

  @computed get temperatureKelvin() {
    console.log("calculating Kelvin") || displayInPreview("calculating Kelvin");
    return this.temperatureCelsius * (9/5) + 32
  }
   
  @computed get temperatureFahrenheit() {
    console.log("calculating Fahrenheit") || displayInPreview("calculating Fahrenheit");
    return this.temperatureCelsius + 273.15
  }
   
  @computed get temperature() {
    console.log("calculating temperature") || displayInPreview("calculating temperature");
    switch(this.unit) {
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

  @action inc() {
    this.setCelsius(this.temperatureCelsius + 1)
  }
}

const App = observer(
  ["temperatures"],
  ({ temperatures }) => (
  <ul>
    <TemperatureInput />
    {temperatures.map(t =>
      <TView key={t.id} temperature={t} />
    )}
    <DevTools />
  </ul>
))

@observer(["temperatures"])
class TemperatureInput extends React.Component {
  @observable input = "";

  render() {
    return (
      <li>
        Destination
        <input onChange={this.onChange}
               value={this.input}
        />
        <button onClick={this.onSubmit}>Add</button>
      </li>
    )
  }

  @action onChange = (e) => {
    this.input = e.target.value
  }
  
  @action onSubmit = () => {
    this.props.temperatures.push(
      new Temperature(this.input)
    )
    this.input = ""
  }
}

@observer class TView extends React.Component {
  render() {
    const t = this.props.temperature
    return (
      <li onClick={this.onTemperatureClick}
      >
        {t.location}:
        {t.loading ? "loading.." : t.temperature}
      </li>
    )
  }
  
  @action onTemperatureClick = () => {
    this.props.temperature.inc()
  }
}

/// index file
const temps = observable([])

ReactDOM.render(
  <Provider temperatures={temps}>
    <App />
  </Provider>,
  document.getElementById("app")
)


   
// display in plunker preview
function displayInPreview(string) {
  var newDiv = document.createElement("div"); 
  var newContent = document.createTextNode(string); 
  newDiv.appendChild(newContent);
  document.body.appendChild(newDiv)
}
   
   