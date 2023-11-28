import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../auth/AuthContext';
import './MedicationHistory.scss';
import DailyAdherenceCalendar from '../DailyAdherenceCalendar/DailyAdherenceCalendar';

function MedicationHistory() {
    const { user } = useContext(AuthContext);
    console.log('User state in Profile component:', user);
    const [medications, setMedications] = useState([]);
    const [loggedMedications, setLoggedMedications] = useState([]);
    const [allTaken, setAllTaken] = useState(false);

    const SERVER_URL = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
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
    
        const fetchLoggedMedications = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/api/medications/logged`, {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
                });
                setLoggedMedications(response.data);
            } catch (error) {
                console.error('Error fetching logged medications:', error);
            }
        };
        
        fetchMedicationsForToday();
        fetchLoggedMedications();
    }, []);


    const handleMedicationAction = async (medicationId, action, time) => {
        try {
            const requestBody = {
                time: time
            };
    
            const response = await axios.post(`${SERVER_URL}/api/medications/${medicationId}/${action}`, requestBody, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });
    
            const { drug_name, strength, action_time } = response.data;
    
            setLoggedMedications(prevLoggedMedications => [
                ...prevLoggedMedications,
                {
                    drug_name,
                    strength,
                    action,
                    action_time
                }
            ]);
            setMedications(prevMedications =>
                prevMedications.map(med => {
                    if (med.id === medicationId) {
                        return {
                            ...med,
                            reminder_times: med.reminder_times.filter(t => t !== time)
                        };
                    }
                    return med;
                })
            );
        } catch (error) {
            console.error(`Error marking medication as ${action}:`, error);
        }
    };
    

    useEffect(() => {
        const updateMedicationsWithLoggedInfo = () => {
            const updatedMedications = medications.map(medication => {
                const loggedForMed = loggedMedications.filter(log => log.user_drug_id === medication.id);
                const remainingTimes = medication.reminder_times.filter(time => 
                    !loggedForMed.some(log => new Date(log.action_time).toLocaleTimeString() === time)
                );
                return {
                    ...medication,
                    reminder_times: remainingTimes
                };
            });
            setMedications(updatedMedications);
            setAllTaken(updatedMedications.every(med => med.reminder_times.length === 0));
        };
    
        if (loggedMedications.length > 0) {
            updateMedicationsWithLoggedInfo();
        }
    }, [loggedMedications]);

    const messageAllTaken = `${user?.firstName || 'User'}, you've taken all your medications for today!`;

    return (
        <div className="medication-history">
            <h1>Medication History</h1>
            <DailyAdherenceCalendar loggedMedications={loggedMedications} />
            <h2>Today’s Log</h2>
            {medications.length === 0 && !allTaken && <p>No medications set for today.</p>}
            {allTaken ? (
                <p>{messageAllTaken}</p>
            ) : (
                medications.map((medication) => (
                    medication.reminder_times.map((time, index) => (
                        <div key={`${medication.id}-${index}`} className="medication-reminder">
                            <p>{user?.firstName || 'User'}, remember to take {medication.drug_name} at {time}</p>
                            <button onClick={() => handleMedicationAction(medication.id, 'skipped', time)}>Skipped</button>
                            <button onClick={() => handleMedicationAction(medication.id, 'taken', time)}>Taken</button>
                        </div>
                    ))
                )))}

            <h3>Logged today:</h3>
            <ul>
                {loggedMedications.map((log, index) => (
                    <li key={index}>
                        {log.drug_name} - {log.strength} - {log.action} at {new Date(log.action_time).toLocaleTimeString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MedicationHistory;
