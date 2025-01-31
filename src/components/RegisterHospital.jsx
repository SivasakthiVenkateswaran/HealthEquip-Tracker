import React, { useState } from 'react';
import axios from 'axios';

const RegisterHospital = () => {
  const [hospitalName, setHospitalName] = useState('');
  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentImage, setEquipmentImage] = useState(null); 
  const [equipmentModel, setEquipmentModel] = useState('');
  const [equipmentYear, setEquipmentYear] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      let formData = new FormData();
      formData.append('hospitalName', hospitalName);
      formData.append('equipmentName', equipmentName);
      formData.append('equipmentModel', equipmentModel);
      formData.append('equipmentYear', equipmentYear);
      if (equipmentImage) {
        formData.append('equipmentImage', equipmentImage);
      }

      const response = await axios.post('http://localhost:5000/hospitals', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      alert("New Hospital Added");
    } catch (error) {
      console.error('Error adding hospital:', error); // Handle error
    }
  };

  const handleImageChange = (e) => {
    setEquipmentImage(e.target.files[0]);
  };

  return (
    <div className='register-hospital'>
      <h2>Add Hospital</h2>
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
          Equipment Name:
          <input
            type="text"
            value={equipmentName}
            onChange={(e) => setEquipmentName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Equipment Model:
          <input
            type="text"
            value={equipmentModel}
            onChange={(e) => setEquipmentModel(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Equipment Year:
          <input
            type="number"
            value={equipmentYear}
            onChange={(e) => setEquipmentYear(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <label>
          Equipment Image:
          <input type="file" onChange={handleImageChange} accept="image/*" />
        </label>
        <br />
        <button type="submit" className='btn'>Submit</button>
      </form>
    </div>
  );
};

export default RegisterHospital;
