import { useEffect, useState } from 'react';
import { Camera, Edit3, X, Save, Lock, User, Mail } from 'lucide-react';

// Mock user data for demo
const mockUser = {
  firstName: "Sarah",
  lastName: "Johnson", 
  email: "sarah.johnson@example.com",
  profileUrl: null
};

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  password?: string;
}

const UserProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Mock data for demo
  const user = mockUser;
  const profilePicture = user?.profileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=c084fc&color=fff&size=200`;

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onSubmit = async (e:any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log(data);
    handleModalToggle();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-pink-900 py-8 px-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div 
                className="relative group cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-1">
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-4 border-white/20"
                  />
                </div>
                <div className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                  <Camera className="w-8 h-8 text-white" />
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full shadow-lg">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="text-center sm:text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-purple-200 text-lg opacity-90 flex items-center gap-2 justify-center sm:justify-start">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
                <div className="flex items-center gap-2 justify-center sm:justify-start mt-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-sm font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={handleModalToggle}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-purple-500/25"
            >
              <Edit3 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Information Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information Card */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-300/30 rounded-3xl p-8 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Personal Information</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <span className="text-purple-300 text-sm font-medium">First Name</span>
                <p className="text-white text-lg font-semibold">{user?.firstName}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <span className="text-purple-300 text-sm font-medium">Last Name</span>
                <p className="text-white text-lg font-semibold">{user?.lastName}</p>
              </div>
            </div>
          </div>

          {/* Security Settings Card */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-300/30 rounded-3xl p-8 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 transform hover:-translate-y-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Security Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <span className="text-pink-300 text-sm font-medium">Password</span>
                <p className="text-white text-lg font-mono">••••••••••</p>
              </div>
              <button className="w-full bg-gradient-to-r from-pink-600/30 to-purple-600/30 hover:from-pink-600/50 hover:to-purple-600/50 text-white border border-pink-400/30 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-xl border border-purple-300/30 rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Edit Profile
              </h2>
              <button 
                onClick={handleModalToggle}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
              >
                <X className="w-6 h-6 text-purple-300" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="firstName" className="block text-purple-300 text-sm font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  defaultValue={user?.firstName}
                  className="w-full bg-white/5 backdrop-blur-sm border border-purple-300/30 rounded-xl px-4 py-3 text-white placeholder-purple-300/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-purple-300 text-sm font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  defaultValue={user?.lastName}
                  className="w-full bg-white/5 backdrop-blur-sm border border-purple-300/30 rounded-xl px-4 py-3 text-white placeholder-purple-300/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-purple-300 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={user?.email}
                  disabled
                  className="w-full bg-white/5 backdrop-blur-sm border border-purple-300/20 rounded-xl px-4 py-3 text-purple-200 opacity-60 cursor-not-allowed"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleModalToggle}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-purple-300 border border-purple-300/30 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSubmit({ target: { elements: document.querySelectorAll('#firstName, #lastName, #email') } });
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;