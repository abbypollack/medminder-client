import { useState, useEffect } from 'react';
import './DrugInteractionInput.scss';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import useAutocomplete from '../UseAutocomplete/UseAutocomplete';

function DrugInteractionInput() {
  const [inputValue, setInputValue] = useState('');
  const [yourDrugs, setYourDrugs] = useState([]);
  const [interactions, setInteractions] = useState([]);

  const { suggestions, fetchSuggestions, loading } = useAutocomplete('https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search');

  useEffect(() => {
    if (inputValue.length > 0) {
      fetchSuggestions(inputValue);
    }
  }, [inputValue]);

  const handleSearch = async () => {
    const apiUrl = 'http://localhost:8080/api/drug/interactions';

    try {
      const response = await axios.post(apiUrl, { drugs: yourDrugs.map((drug) => drug.rxNormId) });
      console.log("API Response:", response.data);
      const interactionData = response.data.interactions.fullInteractionTypeGroup || [];

      const formattedInteractions = interactionData.flatMap(group =>
        group.fullInteractionType.flatMap(type =>
          type.interactionPair.map(pair => ({
            severity: pair.severity || 'Not specified',
            description: pair.description
          }))
        )
      );
      console.log("Formatted Interactions:", formattedInteractions);
      setInteractions(formattedInteractions);
    } catch (error) {
      console.error('Error fetching drug interactions:', error);
    }
  };

  useEffect(() => {
    if (yourDrugs.length > 1) {
      handleSearch();
    }
  }, [yourDrugs, handleSearch]);

  const handleAddDrug = (suggestion) => {
    setYourDrugs([...yourDrugs, { ...suggestion, id: uuidv4() }]);
    setInputValue('');
  };

  const handleRemove = (id) => {
    const updatedDrugs = yourDrugs.filter((drug) => drug.id !== id);
    setYourDrugs(updatedDrugs);
  };

    const handleSaveToProfile = (id) => {
        // TO-DO: Add logic to save a drug to the user's profile
    };

    return (
        <div className="interaction-checker">
            <h2 className="interaction-checker__title">Drug Interaction Checker</h2>
            <div className="interaction-checker__search">
                <input
                    className="interaction-checker__input"
                    type="text"
                    placeholder="Enter two or more drugs..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                {loading && <div>Loading...</div>}
                <ul className="interaction-checker__suggestions">
                    {suggestions.map((suggestion) => (
                        <li key={suggestion.rxNormId} onClick={() => handleAddDrug(suggestion)}>
                            {suggestion.name}
                        </li>
                    ))}
                </ul>
                <button className="interaction-checker__search-button" onClick={handleSearch}>
                    Search
                </button>
            </div>
            <p className="interaction-checker__disclaimer">
                DISCLAIMER: The information contained herein should NOT be used as a substitute for
                the advice of an appropriately qualified and licensed physician or other health care provider.
            </p>
            <h3 className="interaction-checker__drugs-title">Your Drugs</h3>
            <div className="interaction-checker__drugs-list">
                {yourDrugs.map((drug) => (
                    <div className="interaction-checker__drug" key={drug.id}>
                        <span className="interaction-checker__drug-name">{drug.name}</span>
                        <button className="interaction-checker__remove-button" onClick={() => handleRemove(drug.id)}>
                            Remove
                        </button>
                        <button className="interaction-checker__save-button" onClick={() => handleSaveToProfile(drug.id)}>
                            Save to Profile
                        </button>
                    </div>
                ))}
            </div>
            <h3 className="interaction-checker__interactions-title">
                {interactions.length} Interaction(s) Found
            </h3>
            <div className="interaction-checker__interactions-list">
                {interactions.length > 0 ? (
                    interactions.map((interaction) => (
                        <div className="interaction-checker__interaction" key={uuidv4()}>
                            <p><strong>Severity:</strong> {interaction.severity}</p>
                            <p><strong>Description:</strong> {interaction.description}</p>
                        </div>
                    ))
                ) : (
                    <p className="interaction-checker__no-interactions">No interactions found.</p>
                )}
            </div>

        </div>
    );
}
export default DrugInteractionInput;
