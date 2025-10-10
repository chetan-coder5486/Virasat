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
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(user?.profile?.profilePhoto || '');
  const [dialogOpen, setDialogOpen] = useState(false); // <-- controls dialog

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

  const headingClass = 'font-bold text-[#8B4513]';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      //setPreview(imageUrl);
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
      setDialogOpen(false); // <-- close dialog after success
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
      <div
        className="min-h-screen flex items-start justify-center p-10"
        style={{
          background:
            'linear-gradient(to bottom right, #f5fbff, #d8f3ff, #d3f8d3)',
        }}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="shadow-lg rounded-xl flex flex-col md:flex-row w-full max-w-5xl p-8 gap-10 bg-gradient-to-br from-green-100 to-green-200 transition-transform duration-300"
          style={{
            transform: hovered
              ? 'translateY(-5px) scale(1.01)'
              : 'translateY(0) scale(1)',
          }}
        >
          {/* Profile Image */}
          <div className="flex-shrink-0 flex justify-center md:justify-start">
            <Avatar className="w-64 h-64">
              {preview ? (
                <AvatarImage src={preview} alt={user.fullName} />
              ) : (
                <AvatarFallback className="bg-[#D2B48C] text-[#A0522D] text-5xl font-bold flex items-center justify-center">
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
          </div>

          {/* User Details */}
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-4xl font-semibold text-green-800">
              {user.fullName}
            </h1>
            <p className="text-lg text-green-700">
              <span className={headingClass}>Email:</span> {user.email}
            </p>
            {user.phoneNumber && (
              <p className="text-lg text-green-700">
                <span className={headingClass}>Phone:</span> {user.phoneNumber}
              </p>
            )}
            {user.profile?.dob && (
              <p className="text-lg text-green-700">
                <span className={headingClass}>Date of Birth:</span>{' '}
                {new Date(user.profile.dob).toDateString()}
              </p>
            )}
            {user.profile?.gender && (
              <p className="text-lg text-green-700">
                <span className={headingClass}>Gender:</span>{' '}
                {user.profile.gender}
              </p>
            )}
            {user.profile?.location && (
              <p className="text-lg text-green-700">
                <span className={headingClass}>Location:</span>{' '}
                {user.profile.location}
              </p>
            )}
            {user.profile?.bio && (
              <p className="text-lg text-green-700">
                <span className={headingClass}>Bio:</span> {user.profile.bio}
              </p>
            )}

            {/* Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-sm inline-flex w-max">
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
                    className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
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
                        className="bg-gray-300 text-gray-800 hover:bg-gray-400 px-4 py-2 rounded-md"
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      onClick={handleSaveChanges}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-sm inline-flex w-max"
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
    </>
  );
};

export default Profile;
