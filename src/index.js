import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';

import Notiflix from 'notiflix';
Notiflix.Notify.init({ position: 'center-top' });

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryList.style.listStyle = 'none';
countryList.style.padding = '0';
countryList.style.margin = '0';

input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));
function onInputChange() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  fetchCountries(input.value)
    .then(data => {
      renderCountries(data);
    })
    .catch(() =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function renderCountries(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length > 1) {
    countries.forEach(country => {
      countryList.insertAdjacentHTML(
        'beforeend',
        `<li style="display:flex; align-items:center; margin-top:5px; font-size:20px">
        <img src="${country.flags.svg}" style="margin-right:10px" alt="${country.name.common}" width="40">
        ${country.name.official}</li>`
      );
    });
  } else {
    countries.forEach(country => {
      countryInfo.insertAdjacentHTML(
        'beforeend',
        `<h2 style="display:flex; align-items:center; font-size:30px; font-weight:bold; margin-top:0">
        <img src="${country.flags.svg}" style="margin-right:10px" alt="${
          country.name.common
        }" width="40">
        ${country.name.common}</h2>
        <p><span style="font-weight:bold">Capital: </span>${country.capital}</p>
        <p><span style="font-weight:bold">Population: </span>${
          country.population
        }</p>
        <p><span style="font-weight:bold">Languages: </span>${Object.values(
          country.languages
        ).join(', ')}</p>`
      );
    });
  }
}
