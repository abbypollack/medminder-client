import MedicationHistory from '../../components/MedicationHistory/MedicationHistory'
import Unauthenticated from '../../components/Unauthenticated/Unauthenticated';
import { AuthContext } from '../../auth/AuthContext';
import { useContext } from 'react';
import './MedicationHistoryPage.scss'

function MedicationHistoryPage() {
    const { isLoggedIn } = useContext(AuthContext);
    if (!isLoggedIn) {
        return (
            <Unauthenticated />
        );
    }
    return (
        <>
            <MedicationHistory />
        </>
    )
}
export default MedicationHistoryPage
