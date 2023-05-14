import Notiflix from 'notiflix';
import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetch_countries.js';

console.log(Notiflix);

const DEBOUNCE_DELAY = 300;
const searchInput = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


let findCountryName = '';
searchInput.addEventListener('input', () => {
  if (!searchInput.value.trim()) {
    clearEl(countryList);
    clearEl(countryInfo);
    findCountryName = '';
  }
});
const delayedSearch = debounce(() => {
  const searchQuery = searchInput.value.trim();

  // czyszczenie listy po zmianie zmiany nazwy kraju 
  if (!searchQuery) {
    clearEl(countryList);
    return;
  }
  searchCountries(searchQuery);
}, 300);
searchInput.addEventListener('input', delayedSearch);


function searchCountries(searchQuery) {
  if (!searchQuery) {
    clearEl(countryList);
    clearEl(countryInfo);
    return;
  }

  findCountryName = searchQuery;

  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        // return;
      }

      if (countries.length === 1) {
        clearEl(countryList);

        renderCountryInfo(countries[0]);
        // return;
      }
      if (countries.length > 1 && countries.length < 10) {
        clearEl(countryInfo);

        renderCountryList(countries);
      }
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}


function renderCountryList(countries) {
  const html = countries
    .map(country => {
      return `
        <li class="country-list">
          <img class="country-serach"  src="${country.flags.svg}" alt="${country.name.official} flag" width="75", height="55">
          <span>${country.name.common}</span>
        </li>
      `;
    })
    .join('');

  countryList.innerHTML = html;

  if (!html) {
    clearEl(countryInfo);
  }
}

function clearEl(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  const countryFlag = document.querySelector('.country-flag');
  if (countryFlag) {
    countryFlag.remove();
  }
  const countryName = document.querySelector('.country-name');
  if (countryName) {
    countryName.remove();
  }
}

// funkcja renderCountryInfo wyświetla szczegóły jednego kraju.

function renderCountryInfo(country) {
  clearEl(countryInfo);

  const countryName = document.createElement('h3');
  countryName.className = 'country-name';
  countryName.textContent = country.name.official;
  countryInfo.appendChild(countryName);

  const countryFlag = document.createElement('img');
  countryFlag.className = 'country-flag';
  countryFlag.src = country.flags.svg;
  countryFlag.alt = `${country.name.official} flag`;
  countryInfo.appendChild(countryFlag);

  // info o stolicy
  
  const capitalLabel = document.createElement('strong');
  capitalLabel.textContent = 'Capital: ';
  const capital = document.createElement('span');
  capital.textContent = country.capital;
  countryInfo.appendChild(capitalLabel);
  countryInfo.appendChild(capital);

  // info o populacji
  
  const populationLabel = document.createElement('strong');
  populationLabel.textContent = 'Population: ';
  const population = document.createElement('span');
  population.textContent = country.population.toLocaleString();
  countryInfo.appendChild(populationLabel);
  countryInfo.appendChild(population);

  // info o językach 
  
    const languagesLabel = document.createElement('strong');
  languagesLabel.textContent = 'Languages: ';
  const languages = document.createElement('span');
  languages.textContent = Object.values(country.languages).join(', ');
  countryInfo.appendChild(languagesLabel);
  countryInfo.appendChild(languages);
}
searchInput.addEventListener('blur', () => {
  // czyszczenie listy
  if (!searchInput.value.trim()) {
    clearEl(countryList);
  }
});


console.log(gubie, sie);