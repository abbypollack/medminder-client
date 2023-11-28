import { useState, useEffect, useContext } from 'react';
import './DrugInteractionInput.scss';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import useAutocomplete from '../UseAutocomplete/UseAutocomplete';
import { AuthContext } from '../../auth/AuthContext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function DrugInteractionInput() {
  const { isLoggedIn } = useContext(AuthContext);
  const { suggestions, fetchSuggestions, loading } = useAutocomplete('https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search');

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

  useEffect(() => {
    if (drugInputValue.length > 0) {
      fetchSuggestions(drugInputValue);
    }
  }, [drugInputValue]);

  const fetchUserMedications = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No token provided');

      const response = await axios.get(`${SERVER_URL}/api/users/drugs`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const medications = response.data.medications;
      console.log('Medications:', medications)
      setYourDrugs(medications);

      if (medications && medications.length >= 2) {
        const rxNormIds = medications.map(drug => drug.rxNormId).filter(id => id != null);
        handleSearch(rxNormIds);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserMedications();
    }
  }, [isLoggedIn]);

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

    if (!suggestion.rxNormIds || suggestion.rxNormIds.length === 0) {
      console.error('No RxNorm ID found for the selected drug');
      return;
    }

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
    const validDrugs = yourDrugs
      .map(drug => drug.rxNormId)
      .filter(id => id != null && !isNaN(Number(id)));
    console.log("Sending drug IDs to server:", validDrugs);

    if (validDrugs.length >= 2) {
      const apiUrl = `${SERVER_URL}/api/drug/interactions`;
      try {
        const response = await axios.post(apiUrl, { drugs: validDrugs });
        const formattedInteractions = response.data.fullInteractionTypeGroup?.flatMap(group =>
          group.fullInteractionType.flatMap(type =>
            type.interactionPair.map(pair => ({
              severity: pair.severity,
              description: pair.description
            }))
          )
        ) || [];
        setInteractions(formattedInteractions);
      } catch (error) {
        console.error('Error fetching drug interactions:', error);
      }
    } else {
      setInteractions([]);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [yourDrugs]);


  const handleAddDrug = () => {
    if (!selectedDrug || !selectedDrug.name || !selectedStrength || !selectedStrengthRxCUI) {
      console.error('Invalid drug or strength selection');
      return;
    }

    if (!selectedStrengthRxCUI) {
      console.error('RxNorm ID is missing for the selected drug');
      return;
    }

    const drugToAdd = {
      drug_name: selectedDrug.name,
      strength: selectedStrength,
      rxNormId: selectedStrengthRxCUI,
      id: uuidv4()
    };

    setYourDrugs([...yourDrugs, drugToAdd]);
    setSelectedDrug(null);
    setSelectedStrength('');
    setSelectedStrengthRxCUI('');
    setDrugInputValue('');
    setStrengthInputValue('');
    setStrengths([]);
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
    console.log('Drug to save:', drug);

    if (!drug || !drug.drug_name || !drug.rxNormId) {
      console.error('Drug information is incomplete');
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/api/users/drugs`, {
        drugName: drug.drug_name,
        strength: drug.strength,
        rxNormId: drug.rxNormId,
        reminderFrequency,
        reminderTimes
      }, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
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
            <span className="interaction-checker__drug-name">{`${drug.drug_name} - ${drug.strength}`}</span>
            <button className="interaction-checker__remove-button" onClick={() => handleRemove(drug.id)}>Remove</button>
            {isLoggedIn && (
              <button
                className="interaction-checker__save-button"
                onClick={() => handleSaveToProfileModal(drug.id)}
              >
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