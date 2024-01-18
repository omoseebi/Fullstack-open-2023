import axios from 'axios';

const baseUrl = 'http://localhost:3001/persons';

const getAllPersons = () => {
  return axios.get(baseUrl)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
};

const addPerson = (newPerson) => {
  return axios.post(baseUrl, newPerson)
    .then(response => response.data)
    .catch(error => {
      console.error('Error adding person:', error);
      throw error;
    });
};

const deletePerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`);
    return request.then(response => response.data);
  };

export default { getAllPersons, addPerson, deletePerson };
