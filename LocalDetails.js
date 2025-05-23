import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LocalDetails = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  const handleEdit = (index) => {
    const userToEdit = users[index];
    localStorage.setItem("editUser", JSON.stringify({ ...userToEdit, index }));
    navigate("/userform");
  };

  const handleDelete = (index) => {
    const updatedUsers = [...users];
    updatedUsers.splice(index, 1);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
    <div className="container">
      <h2>Local Storage Users</h2>
      {users.length === 0 ? (
        <p>No users stored locally.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>First</th><th>Last</th><th>Mobile</th><th>Address</th><th>Age</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.mobile}</td>
                <td>{user.address}</td>
                <td>{user.age}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>{" "}
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LocalDetails;
