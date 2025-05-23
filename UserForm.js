import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    address: '',
    age: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "firstName" || name === "lastName") {
      newValue = value.replace(/[^A-Za-z]/g, '');
    }

    if (name === "mobile") {
      newValue = value.replace(/\D/g, '').slice(0, 10);
    }

    if (name === "address") {
      newValue = value.slice(0, 70);
    }

    if (name === "age") {
      newValue = value.replace(/\D/g, '');
      if (parseInt(newValue, 10) > 120) {
        newValue = "120";
      }
    }

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.mobile.length !== 10) {
    alert("Mobile number must be exactly 10 digits");
    return;
  }

  const editUserData = JSON.parse(localStorage.getItem("editUser"));
  const localUsers = (JSON.parse(localStorage.getItem("users")) || []).filter(Boolean);

  try {
    if (editUserData && editUserData._id) {
      const response = await fetch(`http://localhost:5000/api/users/${editUserData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const updatedUser = await response.json();
      localUsers[editUserData.index] = updatedUser;
      localStorage.setItem("users", JSON.stringify(localUsers));
      localStorage.removeItem("editUser");

    } else {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const savedUser = await response.json();
      localUsers.push(savedUser);
      localStorage.setItem("users", JSON.stringify(localUsers));
    }

    navigate("/details");
  } catch (err) {
    console.error("Error saving user:", err);
  }
};


  useEffect(() => {
    const editUserData = JSON.parse(localStorage.getItem("editUser"));
    if (editUserData) {
      setFormData({
        firstName: editUserData.firstName || '',
        lastName: editUserData.lastName || '',
        mobile: editUserData.mobile || '',
        address: editUserData.address || '',
        age: editUserData.age || ''
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        mobile: '',
        address: '',
        age: ''
      });
    }
  }, []);

  return (
    <div className='container'>
      <h2>User Form</h2>
      <div className='form'>
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name:</label><br />
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div>
            <label>Last Name:</label><br />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div>
            <label>Mobile Number:</label><br />
            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required />
          </div>
          <div>
            <label>Address:</label><br />
            <textarea name="address" value={formData.address} onChange={handleChange} required />
          </div>
          <div>
            <label>Age:</label><br />
            <input type="number" name="age" value={formData.age} onChange={handleChange} required />
          </div>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
