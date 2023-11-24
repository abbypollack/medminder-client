import './SignUpPage.scss';
import GoogleAuthButton from '../../components/GoogleAuthButton/GoogleAuthButton';
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const { setUser } = useContext(AuthContext);

function SignupPage() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        password: '',
        confirm_password: '',
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });

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
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone: formData.phone,
            };
            const response = await axios.post(`${SERVER_URL}/api/users/register`, data);
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

        if (!formData.first_name.trim()) {
            isValid = false;
            newErrors.first_name = 'First name is required.';
        }

        if (!formData.last_name.trim()) {
            isValid = false;
            newErrors.last_name = 'Last name is required.';
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

        setErrors(newErrors);
        return isValid;
    };

    return (
        <main className="signup-page">
            <form className="signup" onSubmit={handleSubmit}>
                <h1 className="signup__title">Sign up</h1>

                <Input type="text" name="first_name" label="First name" value={formData.first_name} onChange={handleChange} required />
                {errors.first_name && <div className="signup__error">{errors.first_name}</div>}

                <Input type="text" name="last_name" label="Last name" value={formData.last_name} onChange={handleChange} required />
                {errors.last_name && <div className="signup__error">{errors.last_name}</div>}

                <Input type="tel" name="phone" label="Phone" value={formData.phone} onChange={handleChange} required pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number." />
                {errors.phone && <div className="signup__error">{errors.phone}</div>}

                <Input type="email" name="email" label="Email" value={formData.email} onChange={handleChange} required />
                {errors.email && <div className="signup__error">{errors.email}</div>}

                <Input type="password" name="password" label="Password" value={formData.password} onChange={handleChange} required minLength="8" />
                {errors.password && <div className="signup__error">{errors.password}</div>}

                <Input type="password" name="confirm_password" label="Confirm Password" value={formData.confirm_password} onChange={handleChange} required minLength="8" />
                {errors.confirm_password && <div className="signup__error">{errors.confirm_password}</div>}

                <button className="signup__button">Sign up</button>
                <GoogleAuthButton buttonText="Sign Up" />

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
