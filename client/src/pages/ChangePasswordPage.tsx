import React, { useState } from 'react';
import { api } from '../api';

const ChangePasswordPage: React.FC = () => {
  const [form, setForm] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (form.newPass !== form.confirm) {
      setError('New passwords do not match');
      return;
    }

    if (form.newPass.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.changePassword({
        currentPassword: form.current,
        newPassword: form.newPass
      });

      if (response.success) {
        setSuccess(true);
        setForm({ current: '', newPass: '', confirm: '' });
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error: any) {
      console.error('Failed to change password:', error);
      setError(error.message || 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-end pr-0 md:pr-8 lg:pr-16" style={{ backgroundImage: 'url(https://cdn.slidemodel.com/wp-content/uploads/13081-01-gradient-designs-powerpoint-backgrounds-16x9-1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* Left Side Title/Description */}
      <div className="flex-1 flex flex-col justify-center items-center text-center mb-6 md:mb-0 md:mr-8">
        <h1 className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-2xl mb-2" style={{ fontFamily: "'Pacifico', cursive" }}>Eventinity</h1>
        <div className="text-xl md:text-2xl text-white font-medium mb-3 tracking-wide drop-shadow-xl">connecting moments, creating memories</div>
        <div className="w-1/2 mx-auto h-px bg-white/50 rounded-full my-4" />
        <p className="text-lg md:text-xl text-white max-w-sm md:max-w-md mt-1 drop-shadow-xl">
          Eventinity is your gateway to discovering, sharing, and experiencing amazing events. Join our vibrant community and make every moment memorable with us.
        </p>
      </div>
      {/* Right Side: Change Password Form */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border-2 border-purple-100 flex-shrink-0 md:mr-16 lg:mr-32">
        <h1 className="text-2xl font-bold text-purple-700 mb-4 text-center">Change Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-900 font-medium mb-1">Current Password</label>
            <input name="current" type="password" value={form.current} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400" placeholder="Current Password" required />
          </div>
          <div>
            <label className="block text-gray-900 font-medium mb-1">New Password</label>
            <input name="newPass" type="password" value={form.newPass} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400" placeholder="New Password" required />
          </div>
          <div>
            <label className="block text-gray-900 font-medium mb-1">Confirm New Password</label>
            <input name="confirm" type="password" value={form.confirm} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400" placeholder="Confirm New Password" required />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full max-w-xs bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2 rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Changing...
                </>
              ) : (
                'Change Password'
              )}
            </button>
          </div>
        </form>
        {error && <div className="mt-4 text-red-600 text-center font-medium">{error}</div>}
        {success && <div className="mt-4 text-green-600 text-center font-medium">Password changed successfully!</div>}
      </div>
    </div>
  );
};

export default ChangePasswordPage; 