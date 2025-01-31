import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DisplayHospitals = () => {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/hospitals');
        setHospitals(response.data);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };

    fetchHospitals();
  }, []);

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return (
    <div>
      <h2>Hospitals and Equipment</h2>
      {hospitals.map((hospital) => (
        <div key={hospital._id}>
          <h3>{hospital.name}</h3>
          {hospital.equipment.map((equipment, index) => (
            <div key={index}>
              <p>Equipment Name: {equipment.name}</p>
              <p>Model: {equipment.model}</p>
              <p>Year: {equipment.year}</p>
              {equipment.image && (
                <img
                  src={`data:${equipment.image.contentType};base64,${arrayBufferToBase64(equipment.image.image.data)}`}
                  alt={equipment.name}
                  style={{ width: '200px', height: 'auto' }}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DisplayHospitals;
