import { data } from './fetch.js';
import { renderCountries } from './renderCountry.js';

const sortByOptions = document.querySelector('#sort-by__options');
const filterByOptions = document.querySelector('#filter-by__options');
const layout = document.querySelector('.layout');
const btnSortBy = document.querySelector('#sort-by__btn');
const btnFilterBy = document.querySelector('#filter-by__btn');
const searchInput = document.querySelector('.header__search-input');

let renderedData = data;
let searchData = data;
let sortBy = null;
let filterBy = null;

const open = function (optionList) {
  layout.classList.remove('layout--hidden');
  optionList.classList.remove('filter__options--hidden');
  document.body.classList.add('stop-scrolling');
};
const close = function () {
  layout.classList.add('layout--hidden');
  sortByOptions.classList.add('filter__options--hidden');
  filterByOptions.classList.add('filter__options--hidden');
  document.body.classList.remove('stop-scrolling');
};

btnSortBy.addEventListener('click', open.bind(null, sortByOptions));
btnFilterBy.addEventListener('click', open.bind(null, filterByOptions));

layout.addEventListener('click', close);

const uncheckListElements = function (list) {
  [...list.children].forEach(el =>
    el.classList.remove('filter__option--checked')
  );
};

const checkElement = function (element) {
  element.classList.add('filter__option--checked');
};

sortByOptions.addEventListener('click', function (e) {
  const element = e.target.closest('.filter__option');

  if (!element) return;

  if (element.classList.contains('filter__option--checked')) {
    uncheckListElements(this);
    sortBy = null;
  } else {
    uncheckListElements(this);
    checkElement(element);
    sortBy = element.dataset.option;
  }

  finalData(sortBy, filterBy);
});

filterByOptions.addEventListener('click', function (e) {
  const element = e.target.closest('.filter__option');

  if (!element) return;

  if (element.classList.contains('filter__option--checked')) {
    uncheckListElements(this);
    filterBy = null;
  } else {
    uncheckListElements(this);
    checkElement(element);
    filterBy = element.dataset.option;
  }

  finalData(sortBy, filterBy);
});

const finalData = function (sortBy, filterBy) {
  console.log(sortBy);
  renderedData = filterBy
    ? searchData.filter(dt => {
        return dt.region.toLowerCase() === filterBy;
      })
    : searchData;

  console.log(renderedData);

  if (sortBy === 'name') {
    renderedData = searchData
      .flatMap(el => el.name.common)
      .sort()
      .map(name => searchData.find(el => el.name.common === name));
  }
  if (sortBy === 'population') {
    renderedData = searchData
      .map(el => el.population)
      .sort((a, b) => b - a)
      .map(num => searchData.find(el => el.population === num));
  }
  if (sortBy === 'area') {
    renderedData = [...new Set(searchData.map(el => el.region))]
      .sort()
      .flatMap(region => {
        return searchData.filter(country => country.region === region);
      });
  }

  console.log(renderedData);

  renderCountries(renderedData);
};
renderCountries(renderedData);

searchInput.addEventListener('keyup', function () {
  const searchFor = searchInput.value;

  searchData = renderedData
    .flatMap(el => el.name.common)
    .filter(country => country.toLowerCase().startsWith(searchFor))
    .map(name => renderedData.find(el => el.name.common === name));

  console.log(searchData);

  renderCountries(searchData);
});
