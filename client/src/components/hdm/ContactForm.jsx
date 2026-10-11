import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiPaperAirplane } from 'react-icons/hi';
import hdmApi from '../../api/hdm';
import { isValidEmail } from '../../utils/validators';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

const EMPTY = { name: '', email: '', message: '' };

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!isValidEmail(form.email)) e.email = 'Invalid email';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSending(true);
    try {
      await hdmApi.submitContact(form);
      toast.success('Message sent. We will get back to you.');
      setForm(EMPTY);
      setSent(true);
    } catch (err) {
      toast.error(err.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-lg mx-auto">
      <Input
        label="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        error={errors.name}
        placeholder="Your full name"
        disabled={sending}
      />
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        error={errors.email}
        placeholder="you@example.com"
        disabled={sending}
      />
      <Textarea
        label="Message"
        rows={5}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        error={errors.message}
        placeholder="How can we help?"
        disabled={sending}
      />
      <Button
        type="submit"
        loading={sending}
        icon={<HiPaperAirplane className="w-4 h-4" />}
        fullWidth
      >
        {sent ? 'Send Another' : 'Send Message'}
      </Button>
    </form>
  );
}