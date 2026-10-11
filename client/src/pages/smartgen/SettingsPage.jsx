import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  HiUser,
  HiLockClosed,
  HiSun,
  HiMoon,
  HiExclamationCircle,
  HiCheckCircle,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import smartgenApi from '../../api/smartgen';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [savingPass, setSavingPass] = useState(false);

  const [sendingVerify, setSendingVerify] = useState(false);
  const [verifySent, setVerifySent] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await smartgenApi.updateProfile({ name });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const changePass = async (e) => {
    e.preventDefault();
    if (newPass.length < 6) return toast.error('Password must be 6+ characters');
    setSavingPass(true);
    try {
      await smartgenApi.changePassword({
        oldPassword: oldPass,
        newPassword: newPass,
      });
      toast.success('Password changed');
      setOldPass('');
      setNewPass('');
    } catch (err) {
      toast.error(err.message || 'Change failed');
    } finally {
      setSavingPass(false);
    }
  };

  const resendVerification = async () => {
    setSendingVerify(true);
    try {
      await smartgenApi.resendVerification();
      setVerifySent(true);
      toast.success('Verification email sent. Check your inbox.');
    } catch (err) {
      toast.error(err.message || 'Failed to send verification email');
    } finally {
      setSendingVerify(false);
    }
  };

  const notVerified = user && !user.emailVerified;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold">Settings</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Manage your account and preferences
        </p>
      </div>

      {notVerified && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20">
          <HiExclamationCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              {verifySent
                ? 'Verification email sent'
                : 'Your email is not verified'}
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
              {verifySent
                ? `We sent a link to ${user.email}. Click it to verify your account.`
                : 'Verify your email to secure your account and enable all features.'}
            </p>
            {!verifySent && (
              <Button
                size="sm"
                variant="warning"
                onClick={resendVerification}
                loading={sendingVerify}
                className="mt-3"
              >
                Send Verification Email
              </Button>
            )}
            {verifySent && (
              <Button
                size="sm"
                variant="secondary"
                onClick={resendVerification}
                loading={sendingVerify}
                className="mt-3"
              >
                Resend
              </Button>
            )}
          </div>
        </div>
      )}

      {user?.emailVerified && (
        <div className="flex items-start gap-3 p-3 rounded-xl border border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <HiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-900 dark:text-green-200">
              Email verified
            </p>
            <p className="text-xs text-green-800 dark:text-green-300 mt-0.5">
              {user.email}
            </p>
          </div>
        </div>
      )}

      <Card title="Appearance">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-xs text-[var(--text-muted)]">
              Currently: {theme === 'dark' ? 'Dark' : 'Light'}
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={toggleTheme}
            icon={
              theme === 'dark' ? (
                <HiSun className="w-4 h-4" />
              ) : (
                <HiMoon className="w-4 h-4" />
              )
            }
          >
            Switch to {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
        </div>
      </Card>

      <Card title="Profile">
        <form onSubmit={saveProfile} className="space-y-3">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input label="Email" value={user?.email || ''} disabled />
          <Button
            type="submit"
            loading={savingProfile}
            icon={<HiUser className="w-4 h-4" />}
          >
            Update Profile
          </Button>
        </form>
      </Card>

      <Card title="Change Password">
        <form onSubmit={changePass} className="space-y-3">
          <Input
            label="Current Password"
            type="password"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
          />
          <Input
            label="New Password"
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          <Button
            type="submit"
            loading={savingPass}
            icon={<HiLockClosed className="w-4 h-4" />}
          >
            Change Password
          </Button>
        </form>
      </Card>
    </div>
  );
}