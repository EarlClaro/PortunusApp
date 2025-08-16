import { useState } from 'react';
import { loginUser } from '../services/authService';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(form); // don't destructure
      console.log('Login response:', data); // debug

      setAuth(data.user, data.token); // now correct
      navigate('/dashboard'); // redirect
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
      <p>
        No account yet? <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;
