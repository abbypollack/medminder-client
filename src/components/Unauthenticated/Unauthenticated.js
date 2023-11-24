import { Link } from 'react-router-dom';

function Unauthenticated() {
    return (
        <div className="unauthenticated-profile">
            <p><strong>You must be logged in to view.</strong></p>
            <p>Please <Link to="/login">log in</Link> or <Link to="/signup">sign up</Link> to continue.</p>
        </div>
    );
}
export default Unauthenticated;