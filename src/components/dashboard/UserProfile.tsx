import { useEffect, useState } from 'react';
import { FaCamera, FaEdit, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { SaveIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import { useUpdateUserProfileMutation } from '../../features/api/userApi';
import type { RootState } from '../../app/store';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  profileImage?: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(user?.profileUrl || '');
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormValues>();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setValue('firstName', user?.firstName || '');
      setValue('lastName', user?.lastName || '');
      setValue('email', user?.email || '');
      setValue('address', user?.address || '');
      setPreviewImage(user?.profileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName)}&background=9333ea&color=fff&size=128`);
    }
  }, [user, isAuthenticated, setValue, navigate]);

  const handleModalToggle = () => setIsModalOpen(!isModalOpen);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setValue('profileImage', result);
        Swal.fire({
          icon: 'success',
          title: 'Profile Image Updated',
          timer: 1500,
          background: '#fdf4ff',
          showConfirmButton: false
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await updateUserProfile({ userId: user?.userId, ...data }).unwrap();
      Swal.fire("Success", "Profile updated successfully", "success");
      handleModalToggle();
    } catch (error: any) {
      Swal.fire("Error", error?.data?.message || "Failed to update profile", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-fuchsia-100 text-gray-800 py-10 px-5">
      <div className="max-w-4xl mx-auto rounded-xl shadow-2xl bg-white/80 backdrop-blur-md p-6">
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-fuchsia-300 pb-5 mb-5">
          <div className="relative flex items-center gap-4 mb-4 md:mb-0">
            <img
              src={previewImage}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-fuchsia-400 shadow-md object-cover"
            />
            <label className="absolute bottom-0 left-16 bg-fuchsia-500 text-white p-2 rounded-full cursor-pointer shadow">
              <FaCamera />
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            <div>
              <h2 className="text-3xl font-bold text-purple-700">{user?.firstName} {user?.lastName}</h2>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleModalToggle}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 shadow-md flex items-center gap-2"
          >
            <FaEdit /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-100 rounded-lg p-5 shadow-inner">
            <h3 className="text-xl font-semibold mb-3 border-b border-purple-300 pb-1">Personal Info</h3>
            <p className="mb-2"><span className="font-medium">First Name:</span> {user?.firstName}</p>
            <p className="mb-2"><span className="font-medium">Last Name:</span> {user?.lastName}</p>
            <p className="mb-2"><span className="font-medium">Address:</span> {user?.address || 'Not Provided'}</p>
          </div>
          <div className="bg-pink-100 rounded-lg p-5 shadow-inner">
            <h3 className="text-xl font-semibold mb-3 border-b border-pink-300 pb-1">Security</h3>
            <p className="mb-3"><span className="font-medium">Password:</span> ********</p>
            <button className="px-4 py-2 bg-fuchsia-500 text-white rounded-lg shadow hover:bg-fuchsia-600 transition">Change Password</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white text-gray-800 border border-purple-300 rounded-xl w-full max-w-lg p-6 relative">
            <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">Edit Profile</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-purple-600 mb-1">First Name</label>
                <input
                  type="text"
                  {...register('firstName', { required: 'First name is required' })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-purple-300"
                />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-600 mb-1">Last Name</label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Last name is required' })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-purple-300"
                />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-600 mb-1">Email</label>
                <input
                  type="email"
                  disabled
                  {...register('email')}
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-600 mb-1">Address</label>
                <input
                  type="text"
                  {...register('address')}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-pink-300"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={handleModalToggle} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                  <FaTimes /> Cancel
                </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                  <SaveIcon className="w-4 h-4" /> {isLoading ? 'Saving...' : 'Save'}
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
