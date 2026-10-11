import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import AuthCard from '../../components/layout/auth/AuthCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import smartgenApi from '../../api/smartgen';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/smartgen';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await smartgenApi.login({ email, password });
      login(data.token, data.user);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to SmartGen"
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/smartgen/register" className="text-[var(--accent)] font-medium">
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<HiMail />}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<HiLockClosed />}
          required
        />
        <Button type="submit" loading={loading} fullWidth>
          Login
        </Button>
        <div className="text-center text-xs">
          <Link to="/smartgen/forgot" className="text-[var(--text-muted)] hover:text-[var(--accent)]">
            Forgot password?
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}