import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUser, updateUser, deleteUser, getUsers } from '../../features/admin/adminSlice';
import UserForm from './UserForm';  // Make sure this is the correct path to UserForm
import './AdminDashboard.css';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, status, error } = useSelector((state) => state.admin);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getUsers());
    }
  }, [dispatch, status]);

  const handleAddUser = (userData) => {
    dispatch(addUser(userData));
    setIsModalOpen(false);
  };

  const handleUpdateUser = (userData) => {
    dispatch(updateUser({ ...userData, id: selectedUser.id }));
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId));
    }
  };

  const handleTestClick = () => {
    console.log("Test button clicked");
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li className="active" onClick={() => navigate('/admin')}>Users</li>
            <li onClick={() => navigate('/admin/transactions')}>Transactions</li>
            <li onClick={() => navigate('/admin/reports')}>Reports</li>
            <li onClick={() => navigate('/admin/settings')}>Settings</li>
          </ul>
        </nav>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <h1>User Management</h1>
          <div className="admin-header-buttons">
            <button 
              className="add-user-btn"
              onClick={() => {
                setSelectedUser(null);
                setIsModalOpen(true);
              }}
            >
              Add New User
            </button>
            <button 
              className="test-btn"
              onClick={handleTestClick}
            >
              Test Function
            </button>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{users.length}</p>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <p>{users.filter(user => user.status === 'active').length}</p>
          </div>
          <div className="stat-card">
            <h3>Inactive Users</h3>
            <p>{users.filter(user => user.status === 'inactive').length}</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.role}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <UserForm
          user={selectedUser}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={selectedUser ? handleUpdateUser : handleAddUser}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
