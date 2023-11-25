import { useState, useEffect, useContext } from 'react';
import './DrugInteractionInput.scss';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import useAutocomplete from '../UseAutocomplete/UseAutocomplete';
import { AuthContext } from '../../auth/AuthContext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function DrugInteractionInput() {
  const { isLoggedIn } = useContext(AuthContext);

  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const [showModal, setShowModal] = useState(false);
  const [reminderFrequency, setReminderFrequency] = useState('');
  const [reminderTimes, setReminderTimes] = useState([]);
  const [drugInputValue, setDrugInputValue] = useState('');
  const [currentDrugId, setCurrentDrugId] = useState(null);
  const [strengthInputValue, setStrengthInputValue] = useState('');
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [strengths, setStrengths] = useState([]);
  const [yourDrugs, setYourDrugs] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [selectedStrength, setSelectedStrength] = useState('');
  const [selectedStrengthRxCUI, setSelectedStrengthRxCUI] = useState('');

  const { suggestions, fetchSuggestions, loading } = useAutocomplete('https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search');

  useEffect(() => {
    if (drugInputValue.length > 0) {
      fetchSuggestions(drugInputValue);
    }
  }, [drugInputValue]);

  const handleStrengthSelect = (strength, rxNormId) => {
    setSelectedStrength(strength);
    setSelectedStrengthRxCUI(rxNormId);
    setStrengthInputValue(strength);
  };

  const handleDrugSelect = (suggestion) => {
    setSelectedDrug(suggestion);
    const strengths = suggestion.strengthsAndForms || [];
    setStrengths(strengths);
    setDrugInputValue(suggestion.name);
    setStrengthInputValue('');

    if (strengths.length === 1) {
      setSelectedStrength(strengths[0]);
      setSelectedStrengthRxCUI(suggestion.rxNormIds[0]);
    } else {
      setSelectedStrength('');
      setSelectedStrengthRxCUI('');
    }
  };

  const handleFrequencyChange = (e) => {
    const frequency = e.target.value;
    setReminderFrequency(frequency);

    let numberOfInputs;
    switch (frequency) {
      case 'Daily':
        numberOfInputs = 1;
        break;
      case '2 times a day':
        numberOfInputs = 2;
        break;
      case '3 times a day':
        numberOfInputs = 3;
        break;
      case '4 times a day':
        numberOfInputs = 4;
        break;
      case '5 times a day':
        numberOfInputs = 5;
        break;
      case '6 times a day':
        numberOfInputs = 6;
        break;
      case '8 times a day':
        numberOfInputs = 8;
        break;
      default:
        numberOfInputs = 1;
    }

    setReminderTimes(Array(numberOfInputs).fill(''));
  };

  const handleTimeChange = (index, time) => {
    setReminderTimes(prev => {
      const updatedTimes = [...prev];
      updatedTimes[index] = time;
      return updatedTimes;
    });
  };

  const handleSearch = async () => {
    if (yourDrugs.length < 2) {
      setInteractions([]);
      return;
    }
    const apiUrl = `${SERVER_URL}/api/drug/interactions`;

    try {
      const response = await axios.post(apiUrl, { drugs: yourDrugs.map((drug) => drug.rxNormId) });
      console.log("API Response:", response);

      const formattedInteractions = response.data.fullInteractionTypeGroup?.flatMap(group =>
        group.fullInteractionType.flatMap(type =>
          type.interactionPair.map(pair => ({
            severity: pair.severity,
            description: pair.description
          }))
        )
      ) || [];
      console.log("Formatted Interactions:", formattedInteractions);
      setInteractions(formattedInteractions);
    } catch (error) {
      console.error('Error fetching drug interactions:', error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [yourDrugs]);

  const handleAddDrug = () => {
    if (selectedDrug && selectedStrength && selectedStrengthRxCUI) {
      const drugToAdd = {
        name: selectedDrug.name,
        strength: selectedStrength,
        rxNormId: selectedStrengthRxCUI,
        id: uuidv4()
      };
      const newDrugsList = [...yourDrugs, drugToAdd];
      setYourDrugs(newDrugsList);
      setSelectedDrug(null);
      setSelectedStrength('');
      setSelectedStrengthRxCUI('');
      setDrugInputValue('');
      setStrengthInputValue('');
      handleSearch(newDrugsList);
    }
  };

  const handleRemove = (id) => {
    const updatedDrugs = yourDrugs.filter((drug) => drug.id !== id);
    setYourDrugs(updatedDrugs);
    handleSearch(updatedDrugs);
  };

  const handleSaveToProfileModal = (drugId) => {
    if (!isLoggedIn) return;
    setCurrentDrugId(drugId);
    setShowModal(true);
  };

  const handleSaveToProfile = async () => {
    const drug = yourDrugs.find(d => d.id === currentDrugId);
    if (!drug) return;

    try {
      const response = await axios.post(`${SERVER_URL}/api/users/drugs`, {
        drugName: drug.name,
        strength: drug.strength,
        rxnormId: drug.rxNormId,
        reminderFrequency,
        reminderTimes
      }, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      console.log("Saved to profile:", response.data);
      setShowModal(false);
      setReminderFrequency('');
      setReminderTimes([]);
    } catch (error) {
      console.error('Error saving drug to profile:', error);
    }
  };



  return (
    <div className="interaction-checker">
      <h2 className="interaction-checker__title">Drug Interaction Checker</h2>
      <div className="interaction-checker__search">
        <input
          className="interaction-checker__input"
          type="text"
          placeholder="Enter drug name..."
          value={drugInputValue}
          onChange={(e) => setDrugInputValue(e.target.value)}
        />
        {loading && <div>Loading...</div>}
        <ul className="interaction-checker__suggestions">
          {suggestions.map((suggestion) => (
            <li key={suggestion.rxNormId} onClick={() => handleDrugSelect(suggestion)}>
              {suggestion.name}
            </li>
          ))}
        </ul>
        {selectedDrug && (
          <div>
            <input
              type="text"
              placeholder="Select strength..."
              value={strengthInputValue}
              onChange={(e) => setStrengthInputValue(e.target.value)}
              onFocus={() => setStrengthInputValue('')}
            />
            <ul className="interaction-checker__suggestions">
              {strengths.map((strength, index) => (
                <li key={index} onClick={() => handleStrengthSelect(strength, selectedDrug.rxNormIds[index])}>
                  {strength}
                </li>
              ))}
            </ul>
            <button onClick={handleAddDrug}>Add to Interaction Checker</button>
          </div>
        )}
      </div>
      <p className="interaction-checker__disclaimer">
        DISCLAIMER: The information contained herein should NOT be used as a substitute for
        the advice of an appropriately qualified and licensed physician or other health care provider.
      </p>
      <h3 className="interaction-checker__drugs-title">My Medications</h3>
      <div className="interaction-checker__drugs-list">
        {yourDrugs.map((drug) => (
          <div className="interaction-checker__drug" key={drug.id}>
            <span className="interaction-checker__drug-name">{`${drug.name} - ${drug.strength}`}</span>
            <button className="interaction-checker__remove-button" onClick={() => handleRemove(drug.id)}>
              Remove
            </button>
            {isLoggedIn && (
              <button className="interaction-checker__save-button" onClick={() => handleSaveToProfileModal(drug.id)}>
                Save to Profile
              </button>
            )}
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

      {/* Modal for setting reminders */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Set Medication Reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label>Reminder Frequency:</label>
            <select value={reminderFrequency} onChange={handleFrequencyChange}>
              <option value="">Select frequency</option>
              <option value="Daily">Daily</option>
              <option value="2 times a day">2 times a day</option>
              <option value="3 times a day">3 times a day</option>
              <option value="4 times a day">4 times a day</option>
              <option value="5 times a day">5 times a day</option>
              <option value="6 times a day">6 times a day</option>
              <option value="8 times a day">8 times a day</option>
            </select>
          </div>
          {reminderTimes.map((time, index) => (
            <div key={index}>
              <label>Reminder Time {index + 1}:</label>
              <input
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(index, e.target.value)}
              />
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveToProfile}>
            Set Reminder(s)
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default DrugInteractionInput;

