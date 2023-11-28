import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../../auth/AuthContext';
import './MyMedications.scss';
import useAutocomplete from '../UseAutocomplete/UseAutocomplete';

function MyMedications() {
    const { isLoggedIn } = useContext(AuthContext);
    const { suggestions, fetchSuggestions, loading } = useAutocomplete('https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search');

    const SERVER_URL = process.env.REACT_APP_SERVER_URL;

    const [reminderFrequency, setReminderFrequency] = useState('');
    const [reminderTimes, setReminderTimes] = useState([]);

    const [interactions, setInteractions] = useState([]);
    const [medications, setMedications] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedMedication, setSelectedMedication] = useState({ id: '', name: '', strength: '', frequency: '' });
    const [strengths, setStrengths] = useState([]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchMedications();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        fetchInteractions();
    }, [medications]);


    const fetchMedications = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/api/users/drugs`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });
            console.log('Fetched medications:', response.data.medications);
            setMedications(response.data.medications);
        } catch (error) {
            console.error('Error fetching medications:', error);
        }
    };


    const handleAddMedication = async () => {
        const medicationData = {
            drugName: selectedMedication.name,
            strength: selectedMedication.strength,
            rxNormId: selectedMedication.rxNormId,
            reminderFrequency,
            reminderTimes
        };
        console.log('Adding medication:', medicationData);
        const url = `${SERVER_URL}/api/users/drugs`;

        try {
            await axios.post(url, medicationData, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });
            fetchMedications();
            fetchInteractions();
        } catch (error) {
            console.error('Error adding medication:', error);
        }

        handleModalClose();
    };


    const handleEditMedication = async () => {
        const medicationData = {
            drugName: selectedMedication.drug_name,
            strength: selectedMedication.strength,
            rxNormId: selectedMedication.rxNormId,
            reminderFrequency,
            reminderTimes
        };
        console.log('Editing medication:', medicationData);
        const url = `${SERVER_URL}/api/users/drugs/${selectedMedication.id}`;

        try {
            await axios.patch(url, medicationData, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });
            fetchMedications();
            fetchInteractions();
        } catch (error) {
            console.error('Error updating medication:', error);
        }

        handleModalClose();
    };


    const handleRemoveMedication = async () => {
        try {
            await axios.delete(`${SERVER_URL}/api/users/drugs/${selectedMedication.id}`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });
            fetchMedications();
            fetchInteractions();
            console.log('Removing medication with ID:', selectedMedication.id);
        } catch (error) {
            console.error('Error removing medication:', error);
        }
        handleModalClose();
    };

    const handleRemoveConfirmation = () => {
        if (modalMode === 'remove') {
            return (
                <Modal show={showModal} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Remove Medication</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to remove {selectedMedication.name}?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
                        <Button variant="danger" onClick={handleRemoveMedication}>Remove</Button>
                    </Modal.Footer>
                </Modal>
            );
        }
    };

    const handleModalOpen = (mode, medication = null) => {
        setModalMode(mode);
        if (mode === 'add') {
            setSelectedMedication({ id: '', name: '', strength: '', frequency: '' });
            setReminderFrequency('');
            setReminderTimes([]);
        } else if (mode === 'edit' && medication) {
            setSelectedMedication({
                id: medication.id,
                name: medication.drug_name,
                strength: medication.strength,
                frequency: medication.reminder_frequency,
                rxNormId: medication.rxNormId
            });
        } else if (mode === 'remove' && medication) {
            setSelectedMedication({
                id: medication.id,
                name: medication.drug_name,
                strength: medication.strength,
                frequency: medication.reminder_frequency,
                rxNormId: medication.rxNormId
            });
        }
        setShowModal(true);
    };



    useEffect(() => {
        if (selectedMedication && selectedMedication.name.length > 0) {
            fetchSuggestions(selectedMedication.name);
        }
    }, [selectedMedication]);


    const handleModalClose = () => {
        setShowModal(false);
        setSelectedMedication({ name: '', strength: '', frequency: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedMedication(prev => ({ ...prev, [name]: value }));
    };

    const renderMedicationList = () => {
        return medications.map(medication => (
            <div key={medication.id} className="medication-item">
                <div>
                    <span className="medication-name">{medication.drug_name}</span>
                    <span>{`${medication.strength} / ${medication.reminder_frequency}`}</span>
                </div>
                <div>
                    <button onClick={() => handleModalOpen('edit', medication)}>Edit</button>
                    <button onClick={() => handleModalOpen('remove', medication)}>Remove</button>
                </div>
            </div>
        ));
    };

    const handleDrugSelect = (suggestion) => {
        console.log(suggestion)
        setSelectedMedication({
            ...selectedMedication,
            name: suggestion.name,
            rxNormId: suggestion.rxNormIds[0],
            strength: '',
            frequency: ''
        });

        const strengths = suggestion.strengthsAndForms || [];
        setStrengths(strengths);

        console.log('Selected Drug:', selectedMedication);
        console.log('Strengths:', strengths);
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
        setSelectedMedication(prevMedication => ({
            ...prevMedication,
            frequency: frequency
        }));
    };

    const handleTimeChange = (index, time) => {
        setReminderTimes(prev => {
            const updatedTimes = [...prev];
            updatedTimes[index] = time;
            return updatedTimes;
        });
    };

    useEffect(() => {
        if (selectedMedication.name.length > 0) {
            fetchSuggestions(selectedMedication.name);
        }
    }, [selectedMedication.name]);

    const handleStrengthSelect = (e) => {
        const selectedStrength = e.target.value;
        setSelectedMedication(prevMedication => ({
            ...prevMedication,
            strength: selectedStrength
        }));
    };

    const fetchInteractions = async () => {
        if (medications.length < 2) {
            setInteractions([]);
            return;
        }

        const rxNormIds = medications
            .map(medication => medication.rxNormId)
            .filter(id => id && !isNaN(id));

        console.log('Sending rxNormIds for interactions:', rxNormIds);

        if (rxNormIds.length < 2) {
            console.log('Not enough valid rxNormIds for interaction check');
            setInteractions([]);
            return;
        }

        const apiUrl = `${SERVER_URL}/api/drug/interactions`;
        try {
            const response = await axios.post(apiUrl, { drugs: rxNormIds });

            if (response.status === 200) {
                const formattedInteractions = response.data.fullInteractionTypeGroup?.flatMap((group) =>
                    group.fullInteractionType.flatMap((type) =>
                        type.interactionPair.map((pair) => ({
                            severity: pair.severity,
                            description: pair.description,
                        }))
                    )
                ) || [];
                setInteractions(formattedInteractions);
            } else {
                console.error('Unexpected response status:', response.status);
            }
        } catch (error) {
            console.error('Error fetching drug interactions:', error);
        }
    };


    return (
        <div className="my-medications">
            <h1>My Medications</h1>
            <button onClick={() => handleModalOpen('add')}>+Add Medication</button>

            {renderMedicationList()}

            <Modal show={showModal && modalMode !== 'remove'} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalMode === 'add' ? 'Add Medication' : 'Edit Medication'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        placeholder="Enter drug name..."
                        value={selectedMedication.name}
                        onChange={e => setSelectedMedication({ ...selectedMedication, name: e.target.value })}
                    />

                    {loading && <div>Loading...</div>}
                    <ul>
                        {suggestions.map(suggestion => (
                            <li key={suggestion.rxNormId} onClick={() => handleDrugSelect(suggestion)}>
                                {suggestion.name}
                            </li>
                        ))}
                    </ul>
                    {strengths.length > 0 && (
                        <select
                            value={selectedMedication.strength}
                            onChange={handleStrengthSelect}>
                            {strengths.map((strength, index) => (
                                <option key={index} value={strength}>{strength}</option>
                            ))}
                        </select>
                    )}
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
                    {reminderTimes.map((time, index) => (
                        <input
                            key={index}
                            type="time"
                            value={time}
                            onChange={e => handleTimeChange(index, e.target.value)}
                        />
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
                    <Button variant="primary" onClick={() => modalMode === 'add' ? handleAddMedication(selectedMedication) : handleEditMedication(selectedMedication)}>
                        {modalMode === 'add' ? 'Add' : 'Save'}
                    </Button>


                </Modal.Footer>
            </Modal>

            {handleRemoveConfirmation()}

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
export default MyMedications;