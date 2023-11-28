import './SignUpPage.scss';
import GoogleAuthButton from '../../components/GoogleAuthButton/GoogleAuthButton';
import FacebookAuthButton from '../../components/FacebookAuthButton/FacebookAuthButton';
import { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import { AuthContext } from '../../auth/AuthContext'

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function SignupPage() {
    const { setUser } = useContext(AuthContext);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirm_password: '',
        agreeToPhoneUse: false,
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData({
            ...formData, 
            [name]: type === 'checkbox' ? checked : value
        });

        let newErrors = { ...errors };
        if (name === "password" && formData.confirm_password && value !== formData.confirm_password) {
            newErrors.confirm_password = 'Passwords do not match.';
        } else if (name === "confirm_password" && formData.password && value !== formData.password) {
            newErrors.confirm_password = 'Passwords do not match.';
        } else {
            newErrors[name] = '';
        }
        setErrors(newErrors);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        try {
            const data = {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
            };
            const response = await axios.post(`${SERVER_URL}/api/users/register`, data);
            sessionStorage.setItem('token', response.data.token);
            setUser({ ...response.data.user, token: response.data.token });
            setSuccess(true);
            setError("");

            setUser({ ...response.data.user, token: response.data.token });
            event.target.reset();
            navigate('/profile');
        } catch (error) {
            setError(error.response?.data.message || 'Error signing up.');
        }
    };
    

    const validateForm = () => {
        let isValid = true;
        let newErrors = {};

        if (!formData.firstName.trim()) {
            isValid = false;
            newErrors.firstName = 'First name is required.';
        }

        if (!formData.lastName.trim()) {
            isValid = false;
            newErrors.lastName = 'Last name is required.';
        }

        if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
            isValid = false;
            newErrors.phone = 'Please enter a valid 10-digit phone number.';
        }

        if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
            isValid = false;
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!formData.password.trim() || formData.password.length < 8) {
            isValid = false;
            newErrors.password = 'Password must be at least 8 characters.';
        }

        if (formData.password !== formData.confirm_password) {
            isValid = false;
            newErrors.confirm_password = 'Passwords do not match.';
        }

        if (!formData.agreeToPhoneUse) {
            isValid = false;
            newErrors.agreeToPhoneUse = 'You must agree to use your phone number for reminders.';
        }

        setErrors(newErrors);
        return isValid;
    };

    return (
        <main className="signup-page">
            <form className="signup" onSubmit={handleSubmit}>
                <h1 className="signup__title">Sign up</h1>

                <Input type="text" name="firstName" label="First name" value={formData.firstName} onChange={handleChange} required />
                {errors.firstName && <div className="signup__error">{errors.firstName}</div>}

                <Input type="text" name="lastName" label="Last name" value={formData.lastName} onChange={handleChange} required />
                {errors.lastName && <div className="signup__error">{errors.lastName}</div>}

                <Input type="tel" name="phone" label="Phone" value={formData.phone} onChange={handleChange} required pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number." />
                {errors.phone && <div className="signup__error">{errors.phone}</div>}

                <Input type="email" name="email" label="Email" value={formData.email} onChange={handleChange} required />
                {errors.email && <div className="signup__error">{errors.email}</div>}

                <Input type="password" name="password" label="Password" value={formData.password} onChange={handleChange} required minLength="8" />
                {errors.password && <div className="signup__error">{errors.password}</div>}

                <Input type="password" name="confirm_password" label="Confirm Password" value={formData.confirm_password} onChange={handleChange} required minLength="8" />
                {errors.confirm_password && <div className="signup__error">{errors.confirm_password}</div>}
                
                <Input type="checkbox" name="agreeToPhoneUse" label="I agree to use my phone number for reminders" onChange={handleChange} checked={formData.agreeToPhoneUse} required/>
                {errors.agreeToPhoneUse && <div className="signup__error">{errors.agreeToPhoneUse}</div>}

                <button className="signup__button">Sign up</button>
                <GoogleAuthButton buttonText="Sign Up" />
                <FacebookAuthButton buttonText="Sign Up" />

                {success && <div className="signup__message">Signed up!</div>}
                {error && <div className="signup__error">{error}</div>}
            </form>
            <p>
                Have an account? <Link to="/login">Log in</Link>
            </p>
        </main>
    );
}

export default SignupPage;
