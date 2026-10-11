import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import AuthCard from '../../components/layout/auth/AuthCard';
import Spinner from '../../components/ui/Spinner';
import smartgenApi from '../../api/smartgen';

export default function VerifyPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [state, setState] = useState({ loading: true, ok: false, message: '' });

  useEffect(() => {
    if (!token) {
      setState({ loading: false, ok: false, message: 'Missing verification token' });
      return;
    }
    smartgenApi
      .verifyEmail(token)
      .then(() => setState({ loading: false, ok: true, message: 'Email verified successfully' }))
      .catch((err) => setState({ loading: false, ok: false, message: err.message || 'Verification failed' }));
  }, [token]);

  return (
    <AuthCard title="Email Verification">
      <div className="text-center py-4">
        {state.loading ? (
          <Spinner size="lg" />
        ) : state.ok ? (
          <>
            <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
            <p className="text-sm mb-4">{state.message}</p>
            <Link to="/smartgen" className="text-[var(--accent)] text-sm font-medium">Continue to SmartGen</Link>
          </>
        ) : (
          <>
            <HiXCircle className="w-16 h-16 text-red-500 mx-auto mb-3" />
            <p className="text-sm mb-4">{state.message}</p>
            <Link to="/smartgen/login" className="text-[var(--accent)] text-sm font-medium">Go to Login</Link>
          </>
        )}
      </div>
    </AuthCard>
  );
}