import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../auth/AuthContext';
import './MedicationHistory.scss';

function MedicationHistory() {
    const { user } = useContext(AuthContext);
    const [medications, setMedications] = useState([]);
    const [loggedMedications, setLoggedMedications] = useState([]);

    const SERVER_URL = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        fetchMedicationsForToday();
    }, []);

    const fetchMedicationsForToday = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/api/medications/today`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });
            const medicationsWithParsedTimes = response.data.map(med => ({
                ...med,
                reminder_times: JSON.parse(med.reminder_times)
            }));
            setMedications(medicationsWithParsedTimes);
        } catch (error) {
            console.error('Error fetching medications for today:', error);
        }
    };

    const handleMedicationAction = async (medicationId, action) => {
        try {
            await axios.post(`${SERVER_URL}/api/medications/${medicationId}/${action}`, {}, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });
            setLoggedMedications(prevLoggedMedications => [
                ...prevLoggedMedications,
                { ...medications.find(med => med.id === medicationId), action }
            ]);
            setMedications(prevMedications => prevMedications.filter(med => med.id !== medicationId));
        } catch (error) {
            console.error(`Error marking medication as ${action}:`, error);
        }
    };

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


    return (
        <div className="medication-history">
            <h1>Medication History</h1>
            <div className="week-days">
                {weekDays.map(day => (
                    <div key={day} className="day">
                        <span className="day-label">{day}</span>
                        <div className="circle"></div>
                    </div>
                ))}
            </div>
            <h2>Today’s Log</h2>
            {medications.map((medication) => (
                medication.reminder_times.map((time, index) => (
                    <div key={`${medication.id}-${index}`} className="medication-reminder">
                        <p>{user?.firstName || 'User'}, remember to take {medication.drug_name} at {time}</p>
                        <button onClick={() => handleMedicationAction(medication.id, 'skipped')}>Skipped</button>
                        <button onClick={() => handleMedicationAction(medication.id, 'taken')}>Taken</button>
                    </div>
                ))
            ))}

            <h3>Logged today:</h3>
            <ul>
                {loggedMedications.map((medication) => (
                    <li key={medication.id}>{medication.name} - {medication.action}</li>
                ))}
            </ul>
        </div>
    );
}

export default MedicationHistory;
