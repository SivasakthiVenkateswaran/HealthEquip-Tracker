import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import LoadingSpinner2 from "./LoadingSpinner2";

const HospitalDashboard = ({ setIsLoggedIn }) => {
  const [hospitalData, setHospitalData] = useState(null);
  const [editIndex, setEditIndex] = useState(-1);
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [editableEquipment, setEditableEquipment] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState(false);
  const [dload, setDLoad] = useState(false);

  useEffect(() => {
    const fetchHospitalData = async () => {
      const hospitalId = localStorage.getItem("hospitalId");
      if (!hospitalId) {
        setIsLoggedIn(false);
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:5000/hospitals/${hospitalId}`
        );
        setHospitalData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hospital data:", error);
      }
    };

    fetchHospitalData();
  }, [setIsLoggedIn, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("hospitalId");

    setIsLoggedIn(false);
    navigate("/");
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleEditClick = (index, equipment) => {
    setEditIndex(index);
    setEditableEquipment(equipment);
  };

  const handleSaveClick = async (index) => {
    const hospitalId = localStorage.getItem("hospitalId");
    const updatedEquipment = hospitalData.equipment.map((equipment, i) =>
      i === index ? editableEquipment : equipment
    );

    setLoad(true);

    try {
      const response = await axios.put(
        `http://localhost:5000/hospitals/${hospitalId}/equipment`,
        {
          equipment: updatedEquipment,
        }
      );
      setHospitalData(response.data);
      setEditIndex(-1);
      alert("Equipment Updated Successfully");
    } catch (error) {
      console.error("Error updating equipment:", error);
      alert("Failed to update equipment");
    } finally {
      setLoad(false);
    }
  };

  const handleDeleteClick = async (index) => {
    setDeleteIndex(index);
    const hospitalId = localStorage.getItem("hospitalId");
    const updatedEquipment = hospitalData.equipment.filter(
      (_, i) => i !== index
    );

    setDLoad(true);

    try {
      const response = await axios.put(
        `http://localhost:5000/hospitals/${hospitalId}/equipment`,
        {
          equipment: updatedEquipment,
        }
      );
      setHospitalData(response.data);
      alert("Equipment Deleted Successfully");
    } catch (error) {
      console.error("Error deleting equipment:", error);
      alert("Failed to delete equipment");
    } finally {
      setDLoad(false);
      setDeleteIndex(-1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableEquipment({ ...editableEquipment, [name]: value });
  };

  const LoadingSpinner = () => <div className="spinner"></div>;

  if (loading) {
    return (
      <div
        style={{ paddingTop: "5rem", textAlign: "center" }}
        className="spinner-field"
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <span className="dash-log">
        <h2>{hospitalData.name} </h2>
        <span className="button-field">
          <Link to="addequipment">
            <button className="btn">Add</button>
          </Link>
          <button onClick={handleLogout} className="btn">
            Logout
          </button>
        </span>
      </span>
      {hospitalData && (
        <div className="dashboard">
          <div key={hospitalData._id}>
            <h2>Dashboard</h2>
            <div className="card-container">
              {hospitalData.equipment.map((equipment, index) => (
                <div key={index} className="card">
                  <div className="edit-delete-btn-field">
                    {editIndex === index ? (
                      load ? (
                        <LoadingSpinner2 />
                      ) : (
                        <button onClick={() => handleSaveClick(index)}>
                          <IoCheckmarkDoneSharp className="icon" />
                        </button>
                      )
                    ) : (
                      <MdOutlineModeEdit
                        className="icon"
                        onClick={() => handleEditClick(index, equipment)}
                      />
                    )}
                    {deleteIndex === index ? (
                      dload ? (
                        <LoadingSpinner2 />
                      ) : (
                        <MdDelete
                          className="icon"
                          onClick={() => handleDeleteClick(index)}
                        />
                      )
                    ) : (
                      <MdDelete
                        className="icon"
                        onClick={() => handleDeleteClick(index)}
                      />
                    )}
                  </div>
                  {equipment.image && (
                    <img
                      src={`data:${
                        equipment.image.contentType
                      };base64,${arrayBufferToBase64(
                        equipment.image.image.data
                      )}`}
                      alt={equipment.name}
                    />
                  )}
                  <div className="details">
                    <table>
                      <thead>
                        <tr>
                          <th>Equipment Name</th>
                          <th>Model</th>
                          <th>Year</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editIndex === index ? (
                          <tr>
                            <td>
                              <input
                                type="text"
                                name="name"
                                value={editableEquipment.name}
                                onChange={handleChange}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="model"
                                value={editableEquipment.model}
                                onChange={handleChange}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                name="year"
                                value={editableEquipment.year}
                                onChange={handleChange}
                              />
                            </td>
                          </tr>
                        ) : (
                          <tr>
                            <td>{equipment.name}</td>
                            <td>{equipment.model}</td>
                            <td>{equipment.year}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalDashboard;
