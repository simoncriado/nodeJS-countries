"use strict";
exports.__esModule = true;
var fs = require("fs");
var data = fs.readFileSync("./countriesList.txt", {
    encoding: "utf8",
    flag: "r"
});
// Separate the list of countries by line
var separateCountriesListByLines = data.split(/\r?\n/);
separateCountriesListByLines.shift();
// Create an array of induvidual countries, each country with name, population and area separated
var separateCountryData = separateCountriesListByLines.map(function (country) { return country.split(" "); });
// Regex to test the country´s name
var regex = /[a-zA-Z]/;
// Refactor data, calculate country density and return an array for each country with all data
var editCountryData = separateCountryData.map(function (country) {
    var countryName = "";
    var populationAndArea = [];
    for (var i = 0; i < country.length; i++) {
        // Looping through the country array. If letters: adding it to the countryName variable
        if (regex.test(country[i])) {
            countryName = countryName.concat(country[i] + " ");
            // If numbers: adding it to the populationAndArea array
        }
        else if (!regex.test(country[i])) {
            populationAndArea.push(parseFloat(country[i].replace(/,/g, "")));
        }
    }
    // From the populationAndArea array the first value corresponds to the population and the second one to the area
    var countryPopulation = populationAndArea[0];
    var countryArea = populationAndArea[1];
    var countryDensity = 0;
    if (countryPopulation !== 0 &&
        countryPopulation !== undefined &&
        countryArea !== 0 &&
        countryArea !== undefined) {
        countryDensity = Number((countryPopulation / countryArea).toFixed(2));
    }
    return {
        countryName: countryName.trim(),
        countryPopulation: countryPopulation,
        countryArea: countryArea,
        countryDensity: countryDensity
    };
});
// Order the list of countries by density
var sortCountriesByDensity = editCountryData.sort(function (a, b) { return b.countryDensity - a.countryDensity; });
var createCSV = "Name, Population, Area, Density" +
    "\r\n" +
    sortCountriesByDensity.map(function (c) {
        return "\r\n".concat(c.countryName, ", ").concat(c.countryPopulation, ", ").concat(c.countryArea, ", ").concat(c.countryDensity);
    });
fs.writeFileSync("countriesList.csv", createCSV);
