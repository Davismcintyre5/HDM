import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiMail } from 'react-icons/hi';
import AuthCard from '../../components/layout/auth/AuthCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import smartgenApi from '../../api/smartgen';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await smartgenApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Forgot password"
      subtitle={sent ? '' : 'Enter your email to receive a reset link'}
      footer={<Link to="/smartgen/login" className="text-[var(--accent)] font-medium">Back to login</Link>}
    >
      {sent ? (
        <div className="text-center py-4">
          <HiMail className="w-12 h-12 text-[var(--accent)] mx-auto mb-3" />
          <p className="text-sm">
            If <strong>{email}</strong> exists in our system, we have sent a reset link.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<HiMail />} required />
          <Button type="submit" loading={loading} fullWidth>Send Reset Link</Button>
        </form>
      )}
    </AuthCard>
  );
}