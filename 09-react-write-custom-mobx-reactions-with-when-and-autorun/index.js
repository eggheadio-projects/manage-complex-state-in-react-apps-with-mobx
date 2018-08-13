// noprotect
import {
  observable,
  computed,
  action,
  when,
  autorun
} from "mobx";

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
          this.temperatureCelsius = json.main.temp - 273.15
          this.loading = false
        })))
      .catch(function (error) {
        console.log("This city is not in this api, try again.")
      });
  }

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

  @action inc() {
    this.setCelsius(this.temperatureCelsius + 1)
  }
}

const temps = observable([])

function isNice(t) {
  return t.temperatureCelsius > 25
}

when(
  () => temps.some(isNice),
  () => {
    const t = temps.find(isNice)
    alert("Book now! " + t.location)
  }
)

function render(temperatures) {
  return `
    <ul>
    ${temperatures.map(t =>
      `<li>
        ${t.location}:
        ${t.loading ? "loading" : t.temperature}
      </li>`
    ).join("")}
    </ul>
  `
}

temps.push(new Temperature("Amsterdam"))
temps.push(new Temperature("Rotterdam"))

autorun(() => {
  document.getElementById("app").innerHTML =
    render(temps)
})

global.temps = temps /* expose `temps` to the console */
