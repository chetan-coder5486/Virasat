import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import Navbar from './shared/Navbar';
import { updateUserProfile } from '@/redux/authThunks';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [preview, setPreview] = useState(user?.profile?.profilePhoto || '');

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    dob: user?.profile?.dob?.substring(0, 10) || '',
    gender: user?.profile?.gender || '',
    location: user?.profile?.location || '',
    bio: user?.profile?.bio || '',
    profilePhoto: null,
  });

  if (!user) {
    return (
      <p className="text-center mt-20 text-lg text-gray-600">
        No user data found.
      </p>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setFormData((prev) => ({ ...prev, profilePhoto: file }));
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== '') {
          data.append(key, formData[key]);
        }
      }

      const response = await dispatch(
        updateUserProfile({ userId: user._id, formData: data })
      ).unwrap();

      toast.success(response.message || 'Profile updated successfully!');
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 flex flex-col items-center py-16 px-4">
        {/* Profile Card */}
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-3xl overflow-hidden border border-green-100">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 h-48">
            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
              {/* Click-to-Enlarge Avatar */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative group cursor-pointer">
                    <Avatar className="w-60 h-60 border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                      {preview ? (
                        <AvatarImage src={preview} alt={user.fullName} className="object-cover" />
                      ) : (
                        <AvatarFallback className="bg-green-200 text-green-800 text-5xl font-bold">
                          {user.fullName
                            ? user.fullName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                            : 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm rounded-full transition-opacity duration-300">
                      Click to enlarge
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-0 bg-transparent border-none shadow-none flex items-center justify-center">
                  <img
                    src={preview || '/placeholder.png'}
                    alt={user.fullName}
                    className="rounded-2xl max-h-[80vh] object-contain shadow-2xl"
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* User Info */}
          <div className="pt-28 pb-12 px-8 text-center">
            <h1 className="text-3xl font-bold text-green-800">{user.fullName}</h1>
            <p className="text-gray-500">{user.email}</p>

            {/* Info Grid */}
            <div className="grid md:grid-cols-2 gap-4 mt-6 text-left">
              {user.phoneNumber && (
                <div>
                  <p className="text-gray-600 font-semibold">📞 Phone</p>
                  <p className="text-green-800">{user.phoneNumber}</p>
                </div>
              )}
              {user.profile?.dob && (
                <div>
                  <p className="text-gray-600 font-semibold">🎂 Date of Birth</p>
                  <p className="text-green-800">
                    {new Date(user.profile.dob).toDateString()}
                  </p>
                </div>
              )}
              {user.profile?.gender && (
                <div>
                  <p className="text-gray-600 font-semibold">⚧ Gender</p>
                  <p className="text-green-800">{user.profile.gender}</p>
                </div>
              )}
              {user.profile?.location && (
                <div>
                  <p className="text-gray-600 font-semibold">📍 Location</p>
                  <p className="text-green-800">{user.profile.location}</p>
                </div>
              )}
            </div>

            {user.profile?.bio && (
              <div className="mt-6 w-full text-left col-span-full">
                <p className="text-gray-600 font-semibold mb-1">💬 Bio</p>
                <p className="text-green-900 italic">{user.profile.bio}</p>
              </div>
            )}

            {/* Edit Profile Button */}
            <div className="mt-10">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-sm cursor-pointer shadow-md transition-transform transform hover:scale-105">
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] rounded-2xl shadow-2xl p-6 border border-green-200 bg-white/100 backdrop-blur-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-green-700">
                      Edit Profile
                    </DialogTitle>
                  </DialogHeader>

                  <div className="flex flex-col gap-3 mt-2">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <input
                      type="text"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white cursor-pointer"
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="text"
                      name="location"
                      placeholder="Location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <textarea
                      name="bio"
                      placeholder="Bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                    />

                    <div className="flex flex-col items-center mt-3">
                      {preview && (
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-24 h-24 rounded-full object-cover mb-2 shadow-md"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                      />
                    </div>

                    <div className="flex justify-end mt-4 gap-2">
                      <DialogClose asChild>
                        <Button
                          className="bg-gray-300 text-gray-800 hover:bg-gray-400 px-4 py-2 rounded-md cursor-pointer"
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={handleSaveChanges}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-sm inline-flex w-max cursor-pointer"
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
