import { useState } from 'react';
import { changePassword } from '../services/authService';
import useAuthStore from '../store/authStore';

function ChangePassword() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
  const token = useAuthStore((state) => state.token);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changePassword(form, token);
      alert('Password changed successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to change password');
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <input name="oldPassword" type="password" placeholder="Old Password" onChange={handleChange} />
        <input name="newPassword" type="password" placeholder="New Password" onChange={handleChange} />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}

export default ChangePassword;
