import React, { useState } from 'react';
import axios from 'axios';

const AddUsers = () => {
  const [hospitalName, setHospitalName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [physicistEmail, setPhysicistEmail] = useState('');
  const [physicistPassword, setPhysicistPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/add-users', {
        hospitalName,
        adminEmail,
        adminPassword,
        managerEmail,
        managerPassword,
        physicistEmail,
        physicistPassword,
      });

      console.log(response.data); // Handle success
      alert('Admins added successfully');
    } catch (error) {
      console.error('Error adding users:', error); // Handle error
      alert('Failed to add users');
    }
  };

  return (
    <div className='register-hospital'>
      <h2>Add Admins to Hospital</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Hospital Name:
          <input
            type="text"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Admin Email:
          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Admin Password:
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Manager Email:
          <input
            type="email"
            value={managerEmail}
            onChange={(e) => setManagerEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Manager Password:
          <input
            type="password"
            value={managerPassword}
            onChange={(e) => setManagerPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Physicist Email:
          <input
            type="email"
            value={physicistEmail}
            onChange={(e) => setPhysicistEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Physicist Password:
          <input
            type="password"
            value={physicistPassword}
            onChange={(e) => setPhysicistPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit" className='btn'>Submit</button>
      </form>
    </div>
  );
};

export default AddUsers;
