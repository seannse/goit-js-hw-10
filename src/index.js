import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryCardEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(onInputEl, DEBOUNCE_DELAY));

function onInputEl({ target }) {
  const value = target.value.trim();
  if (!value) {
    refs.countryListEl.innerHTML = '';
    refs.countryCardEl.innerHTML = '';
    return;
  }

  fetchCountries(value)
    .then(onFetchCountriesResolveCheck)
    .catch(onFetchCountriesRejectInfo);
}

function onFetchCountriesRejectInfo() {
  Notify.failure('Oops, there is no country with that name');
}

function onFetchCountriesResolveCheck(arr) {
  if (arr.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (arr.length === 1) {
    refs.countryListEl.innerHTML = '';
    onRenderCountryCardMarkup(arr);
  } else {
    refs.countryCardEl.innerHTML = '';
    onRenderCountryListMarkup(arr);
  }
}

function onRenderCountryListMarkup(arr) {
  const markup = arr
    .map(({ name, flags }) => {
      return `<li>
        <svg width="32" height="24">
          <use href="${flags.svg}"></use>
        </svg>
        <p>${name.common}</p>
      </li>`;
    })
    .join('');

  refs.countryListEl.innerHTML = markup;
}

function onRenderCountryCardMarkup(arr) {
  const markup = arr
    .map(country => {
      const { name, capital, population, flags, languages } = country;
      return `<strong style="font-size: 30px;">
        <svg class="flag" width="32" height="24">
          <use href="${flags.svg}"></use>
        </svg>
        ${name.common}
      </strong>
      <p><b>Capital: </b>${capital}</p>
      <p><b>Population: </b>${population}</p>
      <p><b>Languages: </b>${Object.values(languages).join(', ')}</p>
      `;
    })
    .join('');

  refs.countryCardEl.innerHTML = markup;
}
