import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiUser, HiMail, HiLockClosed } from 'react-icons/hi';
import AuthCard from '../../components/layout/auth/AuthCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import smartgenApi from '../../api/smartgen';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail } from '../../utils/validators';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(form.email)) return toast.error('Invalid email');
    if (form.password.length < 6) return toast.error('Password must be 6+ characters');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      const data = await smartgenApi.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(data.token, data.user);
      toast.success('Account created! Check your email to verify.');
      navigate('/smartgen');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create an account"
      subtitle="Join SmartGen today"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/smartgen/login" className="text-[var(--accent)] font-medium">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Full Name"
          value={form.name}
          onChange={update('name')}
          icon={<HiUser />}
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={update('email')}
          icon={<HiMail />}
          required
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={update('password')}
          icon={<HiLockClosed />}
          required
        />
        <Input
          label="Confirm Password"
          type="password"
          value={form.confirm}
          onChange={update('confirm')}
          icon={<HiLockClosed />}
          required
        />
        <Button type="submit" loading={loading} fullWidth>
          Create Account
        </Button>
      </form>
    </AuthCard>
  );
}