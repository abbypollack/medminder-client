import MyMedications from '../../components/MyMedications/MyMedications'
import Unauthenticated from '../../components/Unauthenticated/Unauthenticated';
import { AuthContext } from '../../auth/AuthContext';
import { useContext } from 'react';
import './MyMedicationsPage.scss'

function MyMedicationsPage() {
    const { isLoggedIn } = useContext(AuthContext);
    if (!isLoggedIn) {
        return (
            <Unauthenticated />
        );
    }
    return (
        <>
            <MyMedications />
        </>
    )
}
export default MyMedicationsPage