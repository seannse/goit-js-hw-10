const searchParams = `name,capital,population,flags,languages`

export const fetchCountries = function (name) {
  const url = `https://restcountries.com/v3.1/name/${name}?fields=${searchParams}`
  return fetch(url)
    .then(
    (response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
}

