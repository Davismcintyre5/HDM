import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiLockClosed } from 'react-icons/hi';
import AuthCard from '../../components/layout/auth/AuthCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import smartgenApi from '../../api/smartgen';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error('Missing reset token');
    if (password.length < 6) return toast.error('Password must be 6+ characters');
    if (password !== confirm) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      await smartgenApi.resetPassword({ token, password });
      toast.success('Password reset. Please log in.');
      navigate('/smartgen/login');
    } catch (err) {
      toast.error(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset password"
      subtitle="Choose a new password"
      footer={
        <Link to="/smartgen/login" className="text-[var(--accent)] font-medium">
          Back to login
        </Link>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<HiLockClosed />}
          required
        />
        <Input
          label="Confirm Password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          icon={<HiLockClosed />}
          required
        />
        <Button type="submit" loading={loading} fullWidth>
          Reset Password
        </Button>
      </form>
    </AuthCard>
  );
}