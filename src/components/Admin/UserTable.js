import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, deleteUser } from '../../features/admin/adminSlice';

const UserTable = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.admin);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getUsers());
    }
  }, [status, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  const handleEdit = (user) => {
    // Logic for handling the edit action
    console.log('Editing user:', user);
    // You can navigate to an edit page or open a modal, etc.
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
