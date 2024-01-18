import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CountryInfo = ({ country }) => {
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    axios.get(`https://restcountries.com/v3.1/name/${country}`)
      .then(response => {
        setCountryData(response.data[0]);
      })
      .catch(error => {
        console.error('Error fetching country data:', error);
      });
  }, [country]);

  if (!countryData) {
    return null;
  }

  return (
    <div>
      <h2>{countryData.name.common}</h2>
      <p>Capital: {countryData.capital}</p>
      <p>Area: {countryData.area} km²</p>
      <p>Languages: {Object.values(countryData.languages).join(', ')}</p>
      <img src={countryData.flags.png} alt={`Flag of ${countryData.name.common}`} />
    </div>
  );
}

export default CountryInfo;
