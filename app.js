// Variables
const userInput = document.getElementById('userInput');
const sortingMethod = document.getElementById('sortingMethod');
// Will hold our country data that is fetched
let countryData;
// Will hold our currecny data that is fetched
let currencyData;

// Functions
const gatherAllCountries = () => {
  fetch('https://restcountries.eu/rest/v2/all')
  .then(res => res.json())
  .then(data => {
        countryData = data;
        countryData = addUSConversion(countryData);
        generateDropdown(countryData);
  })
  .catch(err => console.error('Error: ', err));
}

const gatherCurrencyData = () => {
    fetch(`http://data.fixer.io/api/latest?access_key=${config.API_KEY}`)
    .then(res => res.json())
    .then(data => {
        currencyData = data.rates;
    })
    .catch(err => console.error('Error: ', err));
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
    
    const currency = document.createElement('h3');
    currency.innerHTML = `Currency: ${country.currencies[0].name} (${country.currencies[0].symbol})`;
 
    const conversionData = country.USDtoCODE;
    const status = document.createElement('h3');

    if (conversionData >= 1) {
        // CODE belongs to a weak country
        status.innerHTML = 'Status: <span class="strong-country" style="background-color: rgb(243, 243, 243);">Strong</span>';
    } else {
        // CODE belongs to a strong country
        status.innerHTML = 'Status: <span class="weak-country" style="background-color: rgb(243, 243, 243);">Weak</span>';
    }

    const conversionTag = document.createElement('h3');
    conversionTag.innerHTML = `$1 USD = ${conversionData} ${country.currencies[0].symbol}`;

    const populationTag = document.createElement('h4');
    populationTag.innerHTML = `Population Size: ${country.population}`;

    innerDiv.appendChild(name);
    innerDiv.appendChild(flag);
    innerDiv.appendChild(currency);
    innerDiv.appendChild(status);
    innerDiv.appendChild(conversionTag);
    innerDiv.appendChild(populationTag);

    outerDiv.appendChild(innerDiv);
  });
  document.getElementById('root').appendChild(outerDiv);

  const currentSearchQuery = userInput.value;
  filterCountries(currentSearchQuery);
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
    let newData = [...data];

    if (val === '1' || val === '2') {
        newData = newData.filter(country => !Number.isNaN(country.USDtoCODE));
    }

    if (val === '3' || val === '4') {
        newData = newData.filter(country => Boolean(country.population));
    }

    // Sort strongest to weakest
    if (val === '1') {
        newData.sort((a, b) => b.USDtoCODE - a.USDtoCODE);
        return newData;
    }
    // Sort weakest to strongest
    if (val === '2') {
        newData.sort((a, b) => a.USDtoCODE - b.USDtoCODE);
        return newData;
    }

    // Sort by largest to smallest population size
    if (val === '3') {
        newData.sort((a, b) => b.population - a.population);
        return newData;
    }

    // Sort by smallest to largest population size
    if (val === '4') {
        newData.sort((a, b) => a.population - b.population);
        return newData;
    }

    // Sort alphabetically: A-Z
    if (val === '5') {
        // Return original data array as is
        return newData;
    }
    // Sort reverse alphabetically: Z-A
    if (val === '6') {
        return newData.reverse();
    }
}

const filterCountries = (searchQuery) => { 
    // Parent container that contains all country data
    const container = document.querySelector('.countries-container');
    // Individual countries nested within the parent container
    const countries = container.querySelectorAll('.countries-item');

    // Hide and Show countries accordingly instead of making multiple requests - loop through countries and filter matches
    for (let i = 0; i < countries.length; i++) {
        const countryName = countries[i].getElementsByClassName('countries-name')[0];
  
        // If search query matches with country name 
        if (countryName.innerHTML.toLowerCase().indexOf(searchQuery) > -1) {
            countries[i].style.display = '';
        } else {
            countries[i].style.display = 'none';
        }
    }
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
    // Get value of input - make lower case for easier comparisons
    const searchQuery = target.value.toLowerCase();
    filterCountries(searchQuery);
});