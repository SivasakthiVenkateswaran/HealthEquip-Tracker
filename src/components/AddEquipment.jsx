import React, { useState } from 'react';
import axios from 'axios';

const AddEquipment = () => {
  const [hospitalId, setHospitalID] = useState(() => {
    return localStorage.getItem("hospitalId");
  })
  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentImage, setEquipmentImage] = useState(null); // For file upload
  const [equipmentModel, setEquipmentModel] = useState('');
  const [equipmentYear, setEquipmentYear] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare form data for equipment image upload
      let formData = new FormData();
      formData.append('hospitalId', hospitalId);
      formData.append('equipmentName', equipmentName);
      formData.append('equipmentModel', equipmentModel);
      formData.append('equipmentYear', equipmentYear);
      if (equipmentImage) {
        formData.append('equipmentImage', equipmentImage);
      }

      // Send data to Express backend
      const response = await axios.post('http://localhost:5000/addequipment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data); // Handle success
      alert("Equipment added successfully");
    } catch (error) {
      console.error('Error adding hospital:', error); // Handle error
    }
  };

  const handleImageChange = (e) => {
    setEquipmentImage(e.target.files[0]);
  };

  return (
    <div className='register-hospital'>
      <h2>Add Equipment</h2>
      <form onSubmit={handleSubmit}>
        {/* <label>
          Hospital Name:
          <input
            type="text"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            required
          />
        </label> */}
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

export default AddEquipment;
