import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';
import Avatar from '../components/Avatar';

const EditProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    dateOfBirth: ''
  });
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form with user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        dateOfBirth: user.dateOfBirth || ''
      });
      setProfileImg(user.avatar || null);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImg(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);

    try {
      // Call API to update profile
      const response = await api.updateProfile({
        name: form.name,
        phone: form.phone,
        location: form.location,
        dateOfBirth: form.dateOfBirth,
        avatar: profileImg || undefined
      });

      if (response.success) {
        setSuccess(true);

        // Update the user context with the new data
        if (response.user) {
          updateUser(response.user);
        } else {
          // If no user data returned, update with form data
          updateUser({
            name: form.name,
            phone: form.phone,
            location: form.location,
            dateOfBirth: form.dateOfBirth,
            avatar: profileImg || user?.avatar
          });
        }

        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      // You could add error state handling here
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to edit your profile</h2>
          <a href="/login" className="text-blue-600 hover:text-blue-800">Go to Login</a>
        </div>
      </div>
    );
  }

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
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-blue-200 overflow-hidden flex-shrink-0">
        <div className="p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-blue-700 mb-4 text-center drop-shadow">Edit Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {/* Row: Profile Image + Name/Email */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-3">
              <div className="flex flex-col items-center md:items-start flex-shrink-0">
                <div className="relative w-20 h-20 md:w-24 md:h-24 mb-1">
                  {profileImg ? (
                    <img
                      src={profileImg}
                      alt="Profile Preview"
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-blue-200 shadow"
                    />
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24">
                      <Avatar user={user!} size="xl" className="border-blue-200 shadow" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 shadow"
                    title="Change Profile Picture"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" /></svg>
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <span className="text-xs text-gray-500">Change Profile Image</span>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-900 font-semibold mb-1">Name</label>
                  <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 shadow-sm transition-all" placeholder="Your Name" required />
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    placeholder="Your Email"
                    disabled
                    title="Email cannot be changed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed for security reasons</p>
                </div>
              </div>
            </div>
            {/* Phone, Location, Date of Birth */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-900 font-semibold mb-1">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 shadow-sm transition-all"
                  placeholder="Phone Number"
                />
              </div>
              <div>
                <label className="block text-gray-900 font-semibold mb-1">Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 shadow-sm transition-all"
                  placeholder="City/Location"
                />
              </div>
              <div>
                <label className="block text-gray-900 font-semibold mb-1">Date of Birth</label>
                <input
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 shadow-sm transition-all"
                />
              </div>
            </div>
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Your profile has been updated successfully!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage; 