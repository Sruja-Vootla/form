import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MongoDetails = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching MongoDB users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    localStorage.setItem("editUser", JSON.stringify(user));
    navigate("/userform");
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user from MongoDB:", err);
    }
  };

  return (
    <div className="container">
      <h2>MongoDB Users</h2>
      {users.length === 0 ? (
        <p>No users in MongoDB.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>First</th><th>Last</th><th>Mobile</th><th>Address</th><th>Age</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.mobile}</td>
                <td>{user.address}</td>
                <td>{user.age}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>{" "}
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MongoDetails;
