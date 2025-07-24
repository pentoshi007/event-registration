import React, { useState, useRef } from 'react';

const EditProfilePage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    otp: ''
  });
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
    setTimeout(() => setOtpSent(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
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
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-blue-200 overflow-hidden flex-shrink-0">
        <div className="p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-blue-700 mb-4 text-center drop-shadow">Edit Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {/* Row: Profile Image + Name/Email */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-3">
              <div className="flex flex-col items-center md:items-start flex-shrink-0">
                <div className="relative w-20 h-20 md:w-24 md:h-24 mb-1">
                  <img
                    src={profileImg || 'https://ui-avatars.com/api/?name=User&background=E0E7FF&color=3730A3&size=128'}
                    alt="Profile Preview"
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-blue-200 shadow"
                  />
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
                  <div className="flex gap-2">
                    <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 shadow-sm transition-all" placeholder="Your Email" required />
                    <button type="button" onClick={handleSendOtp} className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-semibold">Send OTP</button>
                  </div>
                  {otpSent && <div className="text-green-600 text-xs mt-1">OTP sent to your email!</div>}
                </div>
              </div>
            </div>
            {/* OTP, Phone, Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-900 font-semibold mb-1">OTP Verification</label>
                <input name="otp" value={form.otp} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 shadow-sm transition-all" placeholder="Enter OTP" required />
              </div>
              <div>
                <label className="block text-gray-900 font-semibold mb-1">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 shadow-sm transition-all" placeholder="Phone Number" required />
              </div>
              <div>
                <label className="block text-gray-900 font-semibold mb-1">Location</label>
                <input name="location" value={form.location} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 shadow-sm transition-all" placeholder="City/Location" required />
              </div>
            </div>
            <div className="flex justify-center pt-2">
              <button type="submit" className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all">Save Changes</button>
            </div>
          </form>
          {success && (
            <div className="mt-4 text-green-600 text-center font-medium text-base">Your profile has been updated successfully!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage; 