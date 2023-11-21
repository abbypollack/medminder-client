import './Features.scss'
import { Link } from 'react-router-dom';
import phone from '../../assets/icons/phone.svg'
import keyboard from '../../assets/icons/keyboard.svg'
import calender from '../../assets/icons/calender.svg'
import pills from '../../assets/icons/pill-interaction.svg'
import profile from '../../assets/icons/security.svg'


function Features() {
    return (
        <section className="features">
            <h2 className="features__title">Why MedMinder?</h2>
            <div className="features__container">
                <div className="features__box">
                    <img src={phone} alt="Feature 1" className="features__image" />
                    <p className="features__text"> Reminders For Each Medication Dose</p>
                </div>
                <div className="features__box">
                    <img src={keyboard} alt="Feature 2" className="features__image" />
                    <p className="features__text">Easy Medication Input</p>
                </div>
                <div className="features__box">
                    <img src={calender} alt="Feature 3" className="features__image" />
                    <p className="features__text">Monitor Your Medication Adherence History</p>
                </div>
            </div>
            <div className="features__container">
                <div className="features__box">
                    <img src={pills} alt="Feature 4" className="features__image" />
                    <p className="features__text">Warnings about potential drug interactions</p>
                </div>
                <div className="features__box">
                    <img src={profile} alt="Feature 5" className="features__image" />
                    <p className="features__text">Personalized, Secure Profile</p>
                </div>
            </div>
            <Link to="/signup" className="features__link">
                <button className="features__cta">Create a profile</button>
            </Link>
        </section>
    );
}
export default Features