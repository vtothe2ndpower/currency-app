// Variables
const userInput = document.getElementById('userInput');

userInput.addEventListener('keyup', (e) => {
  const target = e.target;
  const searchQuery = target.value;
  console.log(searchQuery);

  if (searchQuery.length < 3) {
    document.getElementById('root').innerHTML = '';

    return false;
  }

  gatherMatchedCountries(searchQuery);

  // after 2 or more chars 
  // make request

    // Hide and Show accordingly
});


document.addEventListener('DOMContentLoaded', () => {
  gatherAllCountries();
})

// Functions
// This gathers our data from the 3rd party API
const gatherAllCountries = () => {
  fetch('https://restcountries.eu/rest/v2/all')
  .then(res => res.json())
  .then(data => {
    console.log(data);

  })
  .catch(err => console.log('Error: ', err));
}

const gatherMatchedCountries = (userInput) => {
  fetch(`https://restcountries.eu/rest/v2/name/${userInput}`)
  .then(res => res.json())
  .then(data => {
    if (data.status === 404) return false; // No matches found
    
    console.log('User Input: ', userInput);
    console.log(data);
    generateDropdown(data);

  })
  .catch(err => console.log('Error: ', err));
}

const generateDropdown = (data) => {
  // Clears out any potential pre-exisitng values before rendering new ones
  document.getElementById('root').innerHTML = '';

  const outerDiv = document.createElement('div');
  outerDiv.setAttribute('class', 'countries-container');


  data.forEach(country => {
    const innerDiv = document.createElement('div');
    innerDiv.setAttribute('class', 'countries-item');

    const name = document.createElement('h2');
    name.setAttribute('class', 'countries-name')
    name.innerText = country.name
    
    const flag = document.createElement('img');
    flag.setAttribute('src', country.flag);
    flag.setAttribute('width', 500);
    flag.setAttribute('height', 300);
    
    const currency = document.createElement('h3');
    currency.setAttribute('class', 'currency-data');
    currency.innerText = `Currency: ${country.currencies[0].name} (${country.currencies[0].symbol})`;
    currency.setAttribute('currency-code', country.currencies[0].code);

    innerDiv.appendChild(name);
    innerDiv.appendChild(flag);
    innerDiv.appendChild(currency);

    outerDiv.appendChild(innerDiv);
  });
  document.getElementById('root').appendChild(outerDiv);
}

const convertCurrency = (e) => {
  const target = e.target;
  const currencyCode = target.getAttribute('currency-code');

  if (!currencyCode) return false;

  console.log (`Currency code is: ${currencyCode}`);

  // console.log('$1 USD => ');
  // `http://data.fixer.io/api/convert?access_key=${config.API_KEY}&from=USD&to=${currencyCode}&amount=1`
  fetch(`http://data.fixer.io/api/latest?access_key=${config.API_KEY}`)
  .then(res => res.json())
  .then(data => {
    console.log(data);

    const EURtoUSD = data.rates.USD; // 1 EUR => $x USD
    const EURtoCODE = data.rates[currencyCode];
    
    // So $1 USD = EURtoCODE/EURtoUSD 

    // data.rates
    // 1 EUR = .434 COL
    // 1 EUR = 1.231 USD

  })
  .catch(err => console.log('Error: ', err));
}

window.addEventListener('mouseover', convertCurrency);

/*
alpha2Code: "AF"
alpha3Code: "AFG"
altSpellings: (2) ["AF", "Afġānistān"]
area: 652230
borders: (6) ["IRN", "PAK", "TKM", "UZB", "TJK", "CHN"]
callingCodes: ["93"]
capital: "Kabul"
cioc: "AFG"
currencies: Array(1)
0: {code: "AFN", name: "Afghan afghani", symbol: "؋"}
length: 1
__proto__: Array(0)
demonym: "Afghan"
flag: "https://restcountries.eu/data/afg.svg"
gini: 27.8
languages: Array(3)
0: {iso639_1: "ps", iso639_2: "pus", name: "Pashto", nativeName: "پښتو"}
1: {iso639_1: "uz", iso639_2: "uzb", name: "Uzbek", nativeName: "Oʻzbek"}
2: {iso639_1: "tk", iso639_2: "tuk", name: "Turkmen", nativeName: "Türkmen"}
length: 3
__proto__: Array(0)
latlng: (2) [33, 65]
name: "Afghanistan"
nativeName: "افغانستان"
numericCode: "004"
population: 27657145
region: "Asia"
regionalBlocs: [{…}]
subregion: "Southern Asia"
timezones: ["UTC+04:30"]
topLevelDomain: [".af"]
translations:
*/

// Best Places to Travel - Where the American Dollar is Best, where the exchange rate is highest