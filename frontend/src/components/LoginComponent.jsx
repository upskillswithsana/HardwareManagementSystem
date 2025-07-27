/**********************************************************************************************************
 * @file        LoginComponent.jsx
 * @description Component for user login, using user ID, password.
 * @team        SheCodes-Hub (MSITM'26 @ McComb School of Business, UT Austin)
 * @created     2025-07-18
 * @version     v1.0.0
 **********************************************************************************************************/
import React, { useState } from 'react';

// useOutletContext is required so that nested routes(login/register/project etc page) read data passed from the parent
import { useNavigate, useOutletContext  } from 'react-router-dom';
import ReusableHeaderComponent from './ReusableHeaderComponent';
import CancelButton from './CancelButton';

import { postToEndpoint } from '../utils/apiHelpers';
import { showSuccess, showError } from '../utils/toastUtils';


function LoginComponent() {
  
  const [formData, setFormData] = useState({ userid: '', password: ''});
  const navigate = useNavigate();
  const { setIsLoggedIn } = useOutletContext();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  //This will be passed via the props to the CancelButton component
  const resetForm = () => {
    setFormData({userid: '', password: ''});
  };

  const handleSubmit = async (event) => {
  event.preventDefault(); // prevent unnecessary default reloading of UI

    try {
      const { ok, data } = await postToEndpoint('login', {
        username: formData.userid,
        password: formData.password,
      });

      if (ok) {
        showSuccess('Login successful!');
        setIsLoggedIn(true);
        navigate('/resource');
      } else {
        showError(`Login failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      showError('Network error: ' + error.message);
    }
  };

  return (

    <div style={{width: '80vw', maxWidth: '700px', margin: '2.5rem auto'  }}>
      
      {/*Reusable component 'ReusableHeaderComponent' to display page title */}
      <ReusableHeaderComponent 
        title = "Welcome to User Sign-In Page"
        message="" 
      />

      <form onSubmit={handleSubmit}>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ width: '100px' }}>User ID</label>
          <input
            type="text"
            name="userid"
            value={formData.userid}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ width: '100px' }}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" >Login</button>

        {/*Calling reusable CancelButton component*/}
        <CancelButton 
          resetForm={resetForm} 
          redirectTo="/about" 
        />

      </form>

    </div>
  );
}

export default LoginComponent;
