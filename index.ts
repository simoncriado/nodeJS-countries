import * as fs from "fs";

interface Country {
  countryName: string;
  countryPopulation: number;
  countryArea: number;
  countryDensity: number;
}

const data: string = fs.readFileSync("./countriesList.txt", {
  encoding: "utf8",
  flag: "r",
});

// Separate the list of countries by line
const separateCountriesListByLines: string[] = data.split(/\r?\n/);
// Removing the first line which only includes the titles
separateCountriesListByLines.shift();

// Create an array of individual countries, each country with name, population and area separated
const separateCountryData: string[][] = separateCountriesListByLines.map(
  (country: string) => country.split(" ")
);

// Regex to test the country´s name, population and area
const regex: RegExp = /[a-zA-Z]/;

// Refactor data, calculate country density and return an object for each country with all data
const editCountryData: Country[] = separateCountryData.map(
  (country: string[]) => {
    let countryName: string = "";
    let populationAndArea: number[] = [];

    for (let i: number = 0; i < country.length; i++) {
      // Looping through the country array. If contains letters: adding it to the countryName variable
      if (regex.test(country[i])) {
        countryName = countryName.concat(country[i] + " ");
        // If contains NO letters: adding it to the populationAndArea array
      } else if (!regex.test(country[i])) {
        populationAndArea.push(parseFloat(country[i].replace(/,/g, "")));
      }
    }

    // From the populationAndArea array the first value corresponds to the population and the second one to the area
    const countryPopulation: number = populationAndArea[0];
    const countryArea: number = populationAndArea[1];
    let countryDensity: number = 0;
    if (
      countryPopulation !== 0 &&
      countryPopulation !== undefined &&
      countryArea !== 0 &&
      countryArea !== undefined
    ) {
      countryDensity = Number((countryPopulation / countryArea).toFixed(2));
    }

    return {
      countryName: countryName.trim(),
      countryPopulation: countryPopulation,
      countryArea: countryArea,
      countryDensity: countryDensity,
    };
  }
);

// Order the list of countries by density
const sortCountriesByDensity = editCountryData.sort(
  (a, b) => b.countryDensity - a.countryDensity
);

// Creating the data structure used to create the new CSV
const createCSV =
  `Name, Population, Area, Density` +
  "\r\n" +
  sortCountriesByDensity.map(
    (c) =>
      `\r\n${c.countryName}, ${c.countryPopulation}, ${c.countryArea}, ${c.countryDensity}`
  );

fs.writeFileSync("countriesList.csv", createCSV);
