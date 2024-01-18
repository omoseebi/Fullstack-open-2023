import { useState, useEffect } from 'react';
import services from './services'; // Adjust the path based on your project structure

const Filter = ({ searchTerm, handleSearchChange }) => (
  <div>
    Filter by name: <input value={searchTerm} onChange={handleSearchChange} />
  </div>
);

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addPerson }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = ({ persons, handleDelete }) => (
  <div>
    {persons.map((person) => (
      <div key={person.id}>
        {person.name} - {person.number}
        <button onClick={() => handleDelete(person)}>delete</button>
      </div>
    ))}
  </div>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    services.getAllPersons()
      .then(data => setPersons(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
  
    const existingPerson = persons.find(person => person.name === newName);
  
    if (existingPerson) {
      const confirmed = window.confirm(
        `${newName} is already added to the phonebook. Replace the old number with a new one?`
      );
  
      if (confirmed) {
        const updatedPerson = { ...existingPerson, number: newNumber };
  
        services.updatePerson(existingPerson.id, updatedPerson)
          .then(data => {
            setPersons(persons.map(p => (p.id === existingPerson.id ? data : p)));
            setNewName('');
            setNewNumber('');
          })
          .catch(error => console.error('Error updating person:', error));
      }
    } else {
      const newPerson = { name: newName, number: newNumber };
  
      services.addPerson(newPerson)
        .then(data => {
          setPersons([...persons, data]);
          setNewName('');
          setNewNumber('');
        })
        .catch(error => console.error('Error adding person:', error));
    }
  };
  

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleDelete = (person) => {
    const confirmed = window.confirm(`Delete ${person.name}?`);

    if (confirmed) {
      services.deletePerson(person.id)
        .then(() => setPersons(persons.filter(p => p.id !== person.id)))
        .catch(error => console.error('Error deleting person:', error));
    }
  };

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>

      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
