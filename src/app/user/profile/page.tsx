'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import { fetchProfile, updateProfile } from '@/store/authSlice';
import { useToast } from '@/components/ToastProvider';
import Image from 'next/image';

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const { showToast } = useToast();
    const { profile, loading } = useSelector((s: RootState) => s.auth);

    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    useEffect(() => {
        if (profile?.user) {
            setFormData({
                first_name: profile.user.first_name || '',
                last_name: profile.user.last_name || '',
            });
        }
    }, [profile]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('first_name', formData.first_name);
            formDataToSend.append('last_name', formData.last_name);
            if (selectedImage) {
                formDataToSend.append('image', selectedImage);
            }

            await dispatch(updateProfile({ formData: formDataToSend })).unwrap();
            showToast('Profile updated successfully!', 'success');
            setEditing(false);
            setSelectedImage(null);
            setImagePreview(null);
            await dispatch(fetchProfile());
        } catch (err: any) {
            console.error(err);
            showToast(err?.message || 'Failed to update profile', 'error');
        }
    };

    if (loading) {
        return (
            <main className="flex min-h-screen w-full items-center justify-center">
                <div className="card-premium p-8 rounded-lg">
                    <p className="text-pm-gold-500">Loading profile...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen w-full max-w-4xl flex-col items-center py-10 px-4">
            <div className="w-full max-w-2xl card-premium rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-6 text-pm-gold-500">My Profile</h1>

                {/* Profile Image */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative w-32 h-32 mb-4">
                        <Image
                            src={imagePreview || profile?.user?.image_url || 'https://placehold.co/600x400'}
                            alt="Profile"
                            fill
                            className="rounded-full object-cover border-4 border-pm-gold-900"
                            unoptimized
                        />
                    </div>
                    {editing && (
                        <>
                            <input
                                type="file"
                                ref={(ref) => setFileInputRef(ref)}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef?.click()}
                                className="text-sm text-pm-gold-500 hover:text-pm-gold-900 underline"
                            >
                                {selectedImage ? 'Change Photo' : 'Upload Photo'}
                            </button>
                        </>
                    )}
                </div>

                {/* Profile Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-pm-brown-900/50 rounded-lg border border-pm-gold-900/30">
                        <p className="text-sm text-pm-muted">Balance</p>
                        <p className="text-2xl font-bold text-pm-gold-500">
                            ${Number(profile?.user?.balance ?? 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="p-4 bg-pm-brown-900/50 rounded-lg border border-pm-gold-900/30">
                        <p className="text-sm text-pm-muted">Total Profits</p>
                        <p className="text-2xl font-bold text-pm-gold-500">
                            ${Number(profile?.stats?.total_profits ?? 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="p-4 bg-pm-brown-900/50 rounded-lg border border-pm-gold-900/30">
                        <p className="text-sm text-pm-muted">Active Investments</p>
                        <p className="text-2xl font-bold text-pm-gold-500">
                            ${Number(profile?.stats?.active_investment ?? 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="p-4 bg-pm-brown-900/50 rounded-lg border border-pm-gold-900/30">
                        <p className="text-sm text-pm-muted">Referral Code</p>
                        <p className="text-lg font-bold text-pm-gold-500 font-mono">
                            {profile?.user?.referral_code || 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-pm-gold-500 mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                disabled={!editing}
                                className="w-full px-4 py-3 bg-pm-char border border-pm-gold-900 text-pm-gold-500 rounded-lg focus:ring-2 focus:ring-pm-gold-500 focus:border-transparent disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-pm-gold-500 mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                disabled={!editing}
                                className="w-full px-4 py-3 bg-pm-char border border-pm-gold-900 text-pm-gold-500 rounded-lg focus:ring-2 focus:ring-pm-gold-500 focus:border-transparent disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium text-pm-gold-500 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={!editing}
                            className="w-full px-4 py-3 bg-pm-char border border-pm-gold-900 text-pm-gold-500 rounded-lg focus:ring-2 focus:ring-pm-gold-500 focus:border-transparent disabled:opacity-50"
                        />
                    </div> */}

                    {/* <div>
                        <label className="block text-sm font-medium text-pm-gold-500 mb-2">
                            Phone
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            disabled={!editing}
                            className="w-full px-4 py-3 bg-pm-char border border-pm-gold-900 text-pm-gold-500 rounded-lg focus:ring-2 focus:ring-pm-gold-500 focus:border-transparent disabled:opacity-50"
                        />
                    </div> */}

                    <div className="flex gap-3 mt-6">
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="flex-1 btn-gold px-6 py-3 rounded-lg"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => setEditing(false)}
                                    className="flex-1 bg-pm-brown-700 text-pm-gold-500 px-6 py-3 rounded-lg hover:bg-pm-brown-500 transition border border-pm-gold-900/30"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 btn-gold px-6 py-3 rounded-lg"
                                >
                                    Save Changes
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}