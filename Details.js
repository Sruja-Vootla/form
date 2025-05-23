import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserList.css';

const Details = () => {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const localUsers = (JSON.parse(localStorage.getItem("users")) || []).filter(Boolean);

    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((mongoUsers) => {
        const combinedUsers = [...localUsers];

        mongoUsers.forEach((mongoUser) => {
          if (!mongoUser || !mongoUser._id) return;

          const exists = combinedUsers.find(u => u && u._id === mongoUser._id);
          if (!exists) combinedUsers.push(mongoUser);
        });

        setUserList(combinedUsers);
      })
      .catch((err) => {
        console.error("Error fetching MongoDB users:", err);
        setUserList(localUsers);
      });
  }, []);

  const handleEdit = (user, index) => {
    localStorage.setItem("editUser", JSON.stringify({ ...user, index }));
    navigate("/userform");
  };

  const handleDelete = async (index) => {
    if (window.confirm("Delete this user?")) {
      const updated = [...userList];
      const userToDelete = updated[index];

      if (userToDelete._id) {
        try {
          const response = await fetch(`http://localhost:5000/api/users/${userToDelete._id}`, {
            method: "DELETE",
          });

          if (!response.ok) throw new Error("Mongo delete failed");
        } catch (err) {
          console.error("MongoDB delete error:", err);
          return;
        }
      }

      updated.splice(index, 1);
      setUserList(updated);

      const onlyLocalUsers = updated.filter(user => !user._id);
      localStorage.setItem("users", JSON.stringify(onlyLocalUsers));
    }
  };

  const handleAddUser = () => {
    localStorage.removeItem("editUser");
    navigate("/userform");
  };

  return (
    <div className="userlist-container">
      <div className="header">
        <h2 className="userlist-title">User Details</h2>
        <button className="add-user-btn" onClick={handleAddUser}>Add User</button>
      </div>

      {userList.length === 0 ? (
        <p className="no-users">No submissions yet.</p>
      ) : (
        <table className="userlist-table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Mobile</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.mobile}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(user, index)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Details;
