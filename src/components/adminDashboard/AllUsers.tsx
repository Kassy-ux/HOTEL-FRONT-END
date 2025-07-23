import { FiEdit } from "react-icons/fi"
import { userApi } from "../../features/api/userApi"
import type { RootState } from "../../app/store"
import { useSelector } from "react-redux"
import { PuffLoader } from "react-spinners"
import { useState } from "react"
import { FaTimes } from "react-icons/fa"
import { SaveIcon, Users, Shield, User, AlertCircle, Calendar, Mail } from "lucide-react"
import Swal from "sweetalert2"

interface UserDetail {
  userId: number,
  firstName: string
  lastName: string
  profileUrl: string
  email: string,
  role: string,
  createdAt: string
}

const getUserRoleBadge = (role: string) => {
  switch (role) {
    case "admin": 
      return "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200";
    case "disabled": 
      return "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200";
    case "user": 
      return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200";
    default: 
      return "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200";
  }
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case "admin": return <Shield className="w-3 h-3" />;
    case "disabled": return <AlertCircle className="w-3 h-3" />;
    case "user": return <User className="w-3 h-3" />;
    default: return <User className="w-3 h-3" />;
  }
}

export const AllUsers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [selectedRole, setSelectedRole] = useState("");

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: usersData = [], isLoading: userDataIsLoading, error } = userApi.useGetAllUsersProfilesQuery({
    skip: !isAuthenticated
  });

  const [updateUserRole, { isLoading: isUpdating }] = userApi.useUpdateUserProfileMutation();

  const handleModalToggle = (user?: UserDetail) => {
    if (user) {
      setSelectedUser(user);
      setSelectedRole(user.role);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedRole) return;

    try {
      await updateUserRole({ userId: selectedUser.userId, role: selectedRole }).unwrap();
      Swal.fire({
        title: "Success",
        text: "User role updated successfully",
        icon: "success",
        confirmButtonColor: "#8b5cf6"
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Failed to update role",
        icon: "error",
        confirmButtonColor: "#ec4899"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 shadow-lg">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            User Management
          </h1>
          <p className="text-gray-600 text-xl">Manage and oversee all registered users</p>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Users className="mr-3" />
              All Users
            </h2>
          </div>

          <div className="p-8">
            {error ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <AlertCircle className="text-red-500 w-8 h-8" />
                </div>
                <p className="text-red-600 text-lg font-medium">Error fetching users</p>
              </div>
            ) : userDataIsLoading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
                  <PuffLoader color="#8b5cf6" size={40} />
                </div>
                <p className="text-gray-600 text-lg">Loading users...</p>
              </div>
            ) : usersData.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
                  <Users className="text-purple-500 w-8 h-8" />
                </div>
                <p className="text-gray-600 text-lg">No users available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-bold text-gray-700">#</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-700">User</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-700">Joined On</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-700">User Type</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData.map((user: UserDetail) => (
                      <tr 
                        key={user.userId} 
                        className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-300"
                      >
                        <td className="py-6 px-4">
                          <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                            <span className="text-purple-700 font-bold text-sm">{user.userId}</span>
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-14 h-14 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                                <img 
                                  src={user.profileUrl} 
                                  alt="avatar" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-lg">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="flex items-center text-gray-500 text-sm mt-1">
                                <Mail className="w-4 h-4 mr-1" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="font-medium">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getUserRoleBadge(user.role)}`}>
                            {getRoleIcon(user.role)}
                            <span className="ml-2 capitalize">{user.role}</span>
                          </span>
                        </td>
                        <td className="py-6 px-4">
                          <button
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                            onClick={() => handleModalToggle(user)}
                          >
                            <FiEdit className="mr-2" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 w-full max-w-md transform transition-all duration-300 scale-100">
              <div className="px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Shield className="mr-3" />
                  Change User Role
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8">
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-purple-200 mr-4">
                      <img 
                        src={selectedUser.profileUrl} 
                        alt="avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{selectedUser.email}</div>
                    </div>
                  </div>
                  
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                    Select New Role
                  </label>
                  <select
                    id="role"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    required
                  >
                    <option value="">Choose a role...</option>
                    <option value="admin">🛡️ Admin</option>
                    <option value="user">👤 User</option>
                    <option value="disabled">⚠️ Disabled</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleModalToggle()}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isUpdating}
                  >
                    <SaveIcon className="mr-2 w-4 h-4" />
                    {isUpdating ? 'Updating...' : 'Save Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};