import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CountryDetails = ({ country, viewDetails, isSelected, weather }) => (
  <div>
    <h2>{country.name.common}</h2>
    {!isSelected && <button onClick={() => viewDetails(country)}>View Details</button>}
    {isSelected && (
      <div>
        <p>Capital: {country.capital}</p>
        <p>Region: {country.region}</p>
        <p>Population: {country.population}</p>
        <p>Area: {country.area} sq km</p>
        <p>Languages: {getLanguages(country.languages)}</p>
        {weather && <p>Temperature: {weather.temperature}°C</p>}
        {country.flags && country.flags.svg && (
          <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} style={{ maxWidth: '250px', maxHeight: '250px' }} />
        )}
        <hr />
      </div>
    )}
  </div>
);

const getLanguages = (languages) => {
  if (Array.isArray(languages) && languages.length > 0) {
    return languages.map(lang => {
      if (typeof lang === 'string') {
        return lang;
      } else if (typeof lang === 'object' && lang.name) {
        return lang.name;
      } else if (Array.isArray(lang) && lang.length > 0 && typeof lang[0] === 'object' && lang[0].name) {
        return lang.map(l => l.name).join(', ');
      } else {
        return 'N/A';
      }
    }).join(', ');
  } else {
    return 'N/A';
  }
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Fetch weather data when a country is selected
    if (selectedCountry) {
      const capital = selectedCountry.capital[0];
      const weatherAPIKey = 'f536a299e791bb1c401b95bb8ed924e3'; // Replace with your actual weather API key
      const weatherAPIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${weatherAPIKey}&units=metric`;

      axios.get(weatherAPIUrl)
        .then(response => {
          setWeather({
            temperature: response.data.main.temp,
          });
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
          setWeather(null);
        });
    }
  }, [selectedCountry]);

  const searchCountry = async () => {
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/name/${searchQuery}`);
      const data = response.data;

      if (data.length === 0) {
        setErrorMessage('No matching countries found.');
        setCountries([]);
      } else if (data.length > 10) {
        setErrorMessage('Too many countries match the query. Please make your query more specific.');
        setCountries([]);
      } else {
        setCountries(data);
        setErrorMessage('');
        setSelectedCountry(null);
      }
    } catch (error) {
      setErrorMessage('Error fetching data from the API.');
      console.error(error);
    }
  };

  const viewCountryDetails = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <h1>Country Information Viewer</h1>
      <label>
        Search for a country:
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Type country name..."
        />
      </label>
      <button onClick={searchCountry}>Search</button>

      {errorMessage && <p>{errorMessage}</p>}

      {countries.length > 0 && (
        <div>
          {countries.map((country) => (
            <CountryDetails
              key={country.name.common}
              country={country}
              viewDetails={viewCountryDetails}
              isSelected={selectedCountry === country}
              weather={weather}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
