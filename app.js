// Check for what happens on 1-2-3-4-3-2-1 character string count
// CHange the title
// Make responsive

// Variables
const userInput = document.getElementById('userInput');
const practiceButton = document.getElementById('convertButton');
let currencyData;

userInput.addEventListener('keyup', (e) => {
  const target = e.target;
  const searchQuery = target.value;

  gatherMatchedCountries(searchQuery);

// Hide and Show accordingly - instead of making a ton of requests
});

// Functions
// This gathers our country data from the 3rd party API on page load
const gatherAllCountries = () => {
  fetch('https://restcountries.eu/rest/v2/all')
  .then(res => res.json())
  .then(data => {

      console.log(data);
      generateDropdown(data);
  })
  .catch(err => console.log('Error: ', err));
}

const gatherCurrencyData = () => {
    fetch(`http://data.fixer.io/api/latest?access_key=${config.API_KEY}`)
    .then(res => res.json())
    .then(data => {
        currencyData = data.rates;
    })
    .catch(err => console.log('Error: ', err));
  }

// This gathers our country data that matched with the search query
const gatherMatchedCountries = (userInput) => {
  fetch(`https://restcountries.eu/rest/v2/name/${userInput}`)
  .then(res => res.json())
  .then(data => {
    if (data.status === 404) {
        // No matches found
        document.getElementById('root').innerHTML = 'No Matches Found.';
        return false;
    }
    generateDropdown(data);
  })
  .catch(err => console.log('Error: ', err));
}

const generateDropdown = (data) => {
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


    console.log('1: ', country.currencies[0].code);
    const conversionData = calculateConversion(country.currencies[0].code);
    console.log('converstionData : ', conversionData);

    const status = document.createElement('h3');

    if (conversionData >= 1) {
        // CODE belongs to a weak country
        status.innerHTML = `Status: <span class="strong-country">Strong</span>`;
    } else {
        // CODE belongs to a strong country
        status.innerHTML = `Status: <span class="weak-country">Weak</span>`;
    }

    innerDiv.appendChild(name);
    innerDiv.appendChild(flag);
    innerDiv.appendChild(currency);
    innerDiv.appendChild(status);

    outerDiv.appendChild(innerDiv);
  });
  document.getElementById('root').appendChild(outerDiv);
}

const calculateConversion = (currencyCode) => {
    console.log(currencyCode);
    console.log(currencyData);
    // 1 EUR => $x USD
    const EURtoUSD = currencyData['USD']; 
    console.log(EURtoUSD);

    // 1 EUR => CODE's Currency
    const EURtoCODE = currencyData[currencyCode]; 
    console.log(EURtoCODE);

    // $1USD => CODE's Currency
    const USDtoCODE = EURtoCODE / EURtoUSD; 
    console.log(EURtoCODE);

    return USDtoCODE;
}

// Event Listeners
// Display all countries on initial page load - I want them all rendered
document.addEventListener('DOMContentLoaded', () => {
    gatherCurrencyData();
    gatherAllCountries();
});

