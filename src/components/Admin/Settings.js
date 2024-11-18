import React from 'react';

const Settings = () => {
  return (
    <div className="admin-main">
      <div className="admin-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-container">
        <div className="settings-section">
          <h2>General Settings</h2>
          <div className="settings-form">
            <div className="form-group">
              <label>Site Name</label>
              <input type="text" placeholder="Enter site name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter email" />
            </div>
            <div className="form-group">
              <label>Time Zone</label>
              <select>
                <option>Select timezone</option>
                <option>UTC</option>
                <option>GMT</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Security Settings</h2>
          <div className="settings-form">
            <div className="form-group">
              <label>Two-Factor Authentication</label>
              <div className="toggle-switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </div>
            </div>
            <div className="form-group">
              <label>Session Timeout (minutes)</label>
              <input type="number" placeholder="Enter timeout duration" />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Notification Settings</h2>
          <div className="settings-form">
            <div className="form-group">
              <label>Email Notifications</label>
              <div className="toggle-switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </div>
            </div>
            <div className="form-group">
              <label>SMS Notifications</label>
              <div className="toggle-switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </div>
            </div>
          </div>
        </div>

        <button className="save-settings-btn">Save Changes</button>
      </div>
    </div>
  );
};

export default Settings;