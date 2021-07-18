// Check for what happens on 1-2-3-4-3-2-1 character string count
// CHange the title
// Make responsive

// Countries where dollar is strongest - 
// Countries where dollar is weakest - 

// Sort strongest to weakest of hide/shown data

// Variables
const userInput = document.getElementById('userInput');
const practiceButton = document.getElementById('convertButton');
const sortingMethod = document.getElementById('sortingMethod');
let countryData;
let currencyData;


// Functions
// This gathers our country data from the 3rd party API on page load
const gatherAllCountries = () => {
  fetch('https://restcountries.eu/rest/v2/all')
  .then(res => res.json())
  .then(data => {
        countryData = data;
        countryData = addUSConversion(countryData);
        console.log(countryData);
        generateDropdown(countryData);
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
// I could instead filter all the data that I've collected instead of making call after call!
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

    const conversionData = country.USDtoCODE;

    const status = document.createElement('h3');
    const conversionTag = document.createElement('h3');

    if (conversionData >= 1) {
        // CODE belongs to a weak country
        status.innerHTML = 'Status: <span class="strong-country">Strong</span>';
    } else {
        // CODE belongs to a strong country
        status.innerHTML = `Status: <span class="weak-country">Weak</span>`;
    }

    conversionTag.innerHTML = `$1 USD = ${conversionData} ${country.currencies[0].symbol}`;

    innerDiv.appendChild(name);
    innerDiv.appendChild(flag);
    innerDiv.appendChild(currency);
    innerDiv.appendChild(status);
    innerDiv.appendChild(conversionTag);

    outerDiv.appendChild(innerDiv);
  });
  document.getElementById('root').appendChild(outerDiv);
}

const calculateConversion = (currencyCode) => {
    // 1 EUR => $x USD
    const EURtoUSD = currencyData['USD']; 

    // 1 EUR => CODE's Currency
    const EURtoCODE = currencyData[currencyCode]; 

    // $1USD => CODE's Currency
    const USDtoCODE = Number((EURtoCODE / EURtoUSD).toFixed(2)) 

    return USDtoCODE;
}

const addUSConversion = (data) => {
    // Loops through our country data and adds USConversion property
    for (let i = 0; i < data.length; i++) {
        data[i]['USDtoCODE'] = calculateConversion(data[i].currencies[0].code);
    }
    return data;
}

const sortArr = (data, val) => {
    // Sort strongest to weakest
    let newData = [...data];
    newData = newData.filter(country => !Number.isNaN(country.USDtoCODE));

    if (val === '1') {
        newData.sort((a, b) => b.USDtoCODE - a.USDtoCODE);
    }
    // Sort weakest to strongest
    if (val === '2') {
        newData.sort((a, b) => a.USDtoCODE - b.USDtoCODE);
    }

    console.log('newData: ', newData);
    return newData;
}

// Event Listeners
// Display all countries on initial page load - I want them all rendered
document.addEventListener('DOMContentLoaded', () => {
    gatherCurrencyData();
    setTimeout(gatherAllCountries, 250);
});

sortingMethod.addEventListener('change', (e) => {
    const val = e.target.value;
    const newData = sortArr(countryData, val);
    generateDropdown(newData);
});

userInput.addEventListener('keyup', (e) => {
    const target = e.target;
    const searchQuery = target.value;
  
    gatherMatchedCountries(searchQuery);
  
  // Hide and Show accordingly - instead of making a ton of requests
  });

