import './Hero.scss'
import { Link } from 'react-router-dom';
import hero from '../../assets/icons/hero-image.svg'

function Hero() {
    return (
        <section className="hero">
            <div className="hero__container">
                <h1 className="hero__title">MedMinder</h1>
                <p className="hero__text"> Your one-stop solution for  medication management. Just input your meds, and we'll handle the rest—including sending you reminders. No hassle, all health!</p>
            </div>
            <div className="hero__container hero__container--image">
                <img src={hero} alt="hero image" className="hero__image" />
            </div>
            <Link to="/interactioncheck" className="hero__link">
                <button className="hero__cta">Try it out</button>
            </Link>
        </section>
    )
}
export default Hero