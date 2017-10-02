const {observable, computed} = mobx;
const {observer} = mobxReact;
const {Component} = React;
const DevTools = mobxDevtools.default;

const t = new class Temperature {
  @observable unit = "C";
  @observable temperatureCelsius = 25;

  @computed get temperatureKelvin() {
    console.log("calculating Kelvin")
    return this.temperatureCelsius * (9/5) + 32
  }
   
  @computed get temperatureFahrenheit() {
    console.log("calculating Fahrenheit")
    return this.temperatureCelsius + 273.15
  }
   
  @computed get temperature() {
    console.log("calculating temperature")
    switch(this.unit) {
      case "K": return this.temperatureKelvin + "ºK"
      case "F": return this.temperatureFahrenheit + "ºF"
      case "C": return this.temperatureCelsius + "ºC"
    }
  }
}
   
const App = observer(({ temperature }) => (
  <div>
    {temperature.temperature}
    <DevTools />
  </div>
))

ReactDOM.render(
  <App temperature={t} />,
  document.getElementById("app")
)
   
   
   
   
   
   
   
   