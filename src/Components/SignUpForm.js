import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email:'',
    phone_number:'',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (success || error) {
      setSuccess('');
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      setError('Both username ,password and phone number are required.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess('User signed up successfully!');
        setFormData({ username: '', email:'', phone_number:'', password: '', confirmPassword: '' });
        navigate('/Login')
      } else if (response.status === 409) {
        setError('Username already taken. Please try a different one.');
      } else {
        setError('Failed to sign up. Please try again.');
      }
    } catch (error) {
      setError('Failed to sign up due to a network error. Please try again.');
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='signup-form' onSubmit={handleSubmit}>
      <div className='input-group'>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className='input-group'>
        <label htmlFor="username">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className='input-group'>
        <label htmlFor="username">Phone Number</label>
        <input
          type="text"
          id="phone_number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className='input-group'>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className='input-group'>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />
      </div>
      <button className='signup-btn' type="submit" disabled={loading}>
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>
      {error && <p style={{ color: 'red' }} aria-live="assertive">{error}</p>}
      {success && <p style={{ color: 'green' }} aria-live="polite">{success}</p>}
    </form>
  );
};

export default SignUpForm;