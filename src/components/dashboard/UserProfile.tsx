import { useEffect, useState } from 'react';
import { FaCamera, FaEdit, FaTimes } from 'react-icons/fa';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { SaveIcon } from 'lucide-react';
import { useUpdateUserProfileMutation } from '../../features/api/userApi';
import Swal from 'sweetalert2';
import type { RootState } from '../../app/store';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  const profilePicture = user?.profileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName)}&background=4ade80&color=fff&size=128`;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

  const handleModalToggle = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (role !== 'admin') {
      navigate('/dashboard/me');
    }
  }, [isAuthenticated, role, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      address: user?.address || '',
    }
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await updateUserProfile({ userId: user?.userId, ...data }).unwrap();
      Swal.fire("Success", "Profile updated successfully", "success");
      handleModalToggle();
    } catch (error: any) {
      Swal.fire("Error", error?.data?.message || "Failed to update profile", "error");
    }
  };

  return (
    <div className="min-h-screen text-white py-10 px-5 bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="max-w-4xl mx-auto rounded-xl shadow-2xl bg-gray-950/60 backdrop-blur-md p-6">
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-700 pb-5 mb-5">
          <div className="relative flex items-center gap-4 mb-4 md:mb-0">
            <img
              src={profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-orange-500 shadow-md"
            />
            <label className="absolute bottom-0 bg-orange-500 p-2 rounded-full cursor-pointer shadow">
              <FaCamera />
              <input type="file" className="hidden" />
            </label>
            <div>
              <h2 className="text-3xl font-bold text-orange-400">{user?.firstName} {user?.lastName}</h2>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>
          <button className="btn btn-warning flex items-center gap-2 shadow-md" onClick={handleModalToggle}>
            <FaEdit /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-orange-700 to-amber-600 rounded-lg p-5 shadow-inner">
            <h3 className="text-2xl font-bold mb-3 border-b border-white pb-1">Personal Info</h3>
            <p className="mb-2 text-gray-100">
              <span className="font-semibold">First Name:</span> {user?.firstName}
            </p>
            <p className="mb-2 text-gray-100">
              <span className="font-semibold">Last Name:</span> {user?.lastName}
            </p>
            <p className="mb-2 text-gray-100">
              <span className="font-semibold">Address:</span> {user?.address || 'Not Provided'}
            </p>
          </div>
          <div className="bg-gradient-to-r from-orange-700 to-amber-600 rounded-lg p-5 shadow-inner">
            <h3 className="text-2xl font-bold mb-3 border-b border-white pb-1">Security Settings</h3>
            <p className="mb-3 text-gray-100">
              <span className="font-semibold">Password:</span> ********
            </p>
            <button className="btn btn-secondary shadow">Change Password</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal modal-open bg-black bg-opacity-70">
          <div className="modal-box bg-gray-900 text-white border border-orange-600 rounded-xl">
            <div className="flex justify-center items-center mb-4">
              <h2 className="text-2xl font-bold text-orange-500">Edit Profile</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-orange-500">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  className="input input-bordered w-full text-black"
                  {...register('firstName', { required: 'First name is required' })}
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="block text-sm font-medium text-orange-500">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  className="input input-bordered w-full text-black"
                  {...register('lastName', { required: 'Last name is required' })}
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-orange-500">Email</label>
                <input
                  type="email"
                  id="email"
                  disabled
                  className="input input-bordered w-full bg-gray-700 text-white"
                  {...register('email')}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-orange-500">Address</label>
                <input
                  type="text"
                  id="address"
                  className="input input-bordered w-full text-black"
                  {...register('address')}
                />
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={handleModalToggle} className="btn mr-2 btn-error">
                  <FaTimes /> Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  <SaveIcon /> {isLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
