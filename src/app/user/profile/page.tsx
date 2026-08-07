'use client';
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import { fetchProfile, updateProfile } from '@/store/authSlice';
import { useToast } from '@/components/ToastProvider';
import Image from 'next/image';
import {
    FaCamera,
    FaCopy,
    FaCheck,
    FaCoins,
    FaChartLine,
    FaLayerGroup,
    FaEnvelope,
    FaShieldAlt,
    FaSave,
    FaTimes,
    FaEdit,
} from 'react-icons/fa';

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const { showToast } = useToast();
    const { profile, loading } = useSelector((s: RootState) => s.auth);

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [copiedRef, setCopiedRef] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    const handleCopyReferral = () => {
        const code = profile?.user?.referral_code;
        if (code) {
            navigator.clipboard.writeText(code);
            setCopiedRef(true);
            showToast('Referral code copied!', 'success');
            setTimeout(() => setCopiedRef(false), 2000);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('first_name', formData.first_name);
            formDataToSend.append('last_name', formData.last_name);
            if (selectedImage) {
                formDataToSend.append('image', selectedImage);
            }

            await dispatch(updateProfile({ formData: formDataToSend })).unwrap();
            showToast('Profile updated successfully! 🎉', 'success');
            setEditing(false);
            setSelectedImage(null);
            setImagePreview(null);
            await dispatch(fetchProfile());
        } catch (err: any) {
            showToast(err?.message || 'Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    const user = profile?.user;
    const getInitials = () => {
        const f = user?.first_name ? user.first_name[0].toUpperCase() : '';
        const l = user?.last_name ? user.last_name[0].toUpperCase() : '';
        return `${f}${l}` || 'SP';
    };

    if (loading && !profile) {
        return (
            <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-8 text-center text-xs text-[#8B85A3]">
                Loading profile information...
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            {/* Header Banner */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#F4F2FB] tracking-tight">Profile & Account</h1>
                    <p className="text-xs text-[#8B85A3]">Manage your account details, avatar, and personal preferences</p>
                </div>
            </div>

            {/* Profile Overview Header Card */}
            <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-6 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-5 pb-4 border-b border-[#221E2F]">
                    {/* Avatar Container */}
                    <div className="relative group">
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#7C5CF0] bg-[#1C1826] text-2xl font-bold text-[#B9A4F7] shadow-xl shadow-[#7C5CF0]/20 overflow-hidden flex-shrink-0">
                            {imagePreview || user?.image_url ? (
                                <Image
                                    src={imagePreview || user?.image_url || ''}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <span>{getInitials()}</span>
                            )}
                        </div>

                        {/* Camera upload badge */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                if (!editing) setEditing(true);
                                setTimeout(() => fileInputRef.current?.click(), 50);
                            }}
                            title="Upload Photo"
                            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#7C5CF0] text-white shadow-lg transition hover:bg-[#6A49E0] active:scale-95"
                        >
                            <FaCamera className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <div className="text-center sm:text-left space-y-1.5 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h2 className="text-lg font-bold text-[#F4F2FB]">
                                {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Valued Member' : 'Member Profile'}
                            </h2>
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#7C5CF0]/30 bg-[#7C5CF0]/15 px-3 py-0.5 text-[11px] font-semibold text-[#A78BFA] w-fit mx-auto sm:mx-0">
                                <FaShieldAlt className="h-3 w-3 text-[#A78BFA]" />
                                <span>{user?.role || 'Verified User'}</span>
                            </span>
                        </div>
                        <p className="text-xs font-mono text-[#8B85A3] flex items-center justify-center sm:justify-start gap-1.5">
                            <FaEnvelope className="h-3 w-3 text-[#6F6A83]" />
                            <span>{user?.email || 'N/A'}</span>
                        </p>
                        {selectedImage && (
                            <p className="text-xs font-semibold text-[#22C55E]">
                                New photo selected: {selectedImage.name}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-2 rounded-xl bg-[#7C5CF0] px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#7C5CF0]/25 transition hover:bg-[#6A49E0] active:scale-95"
                            >
                                <FaEdit className="h-3.5 w-3.5" />
                                <span>Edit Profile</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setEditing(false);
                                        setSelectedImage(null);
                                        setImagePreview(null);
                                        if (user) {
                                            setFormData({
                                                first_name: user.first_name || '',
                                                last_name: user.last_name || '',
                                            });
                                        }
                                    }}
                                    className="flex items-center gap-1.5 rounded-xl border border-[#221E2F] bg-[#1A1626] px-3.5 py-2.5 text-xs font-semibold text-[#8B85A3] transition hover:bg-[#221E2F] hover:text-[#F4F2FB]"
                                >
                                    <FaTimes className="h-3.5 w-3.5" />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 rounded-xl bg-[#7C5CF0] px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#7C5CF0]/25 transition hover:bg-[#6A49E0] active:scale-95 disabled:opacity-50"
                                >
                                    <FaSave className="h-3.5 w-3.5" />
                                    <span>{saving ? 'Saving...' : 'Save'}</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-2xl border border-[#221E2F] bg-[#1A1626] p-3.5 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-[#8B85A3]">
                            <FaCoins className="h-3 w-3 text-[#A78BFA]" />
                            <span>Staking Balance</span>
                        </div>
                        <p className="text-base font-bold text-[#F4F2FB]">
                            ${Number(user?.balance ?? 0).toFixed(2)}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#221E2F] bg-[#1A1626] p-3.5 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-[#8B85A3]">
                            <FaChartLine className="h-3 w-3 text-[#22C55E]" />
                            <span>Total Profits</span>
                        </div>
                        <p className="text-base font-bold text-[#22C55E]">
                            +${Number(profile?.stats?.total_profits ?? 0).toFixed(2)}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#221E2F] bg-[#1A1626] p-3.5 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-[#8B85A3]">
                            <FaLayerGroup className="h-3 w-3 text-[#3B82F6]" />
                            <span>Active Stake</span>
                        </div>
                        <p className="text-base font-bold text-[#F4F2FB]">
                            ${Number(profile?.stats?.active_investment ?? profile?.stats?.active_staking ?? 0).toFixed(2)}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#221E2F] bg-[#1A1626] p-3.5 space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[#8B85A3]">Referral Code</span>
                            {user?.referral_code && (
                                <button
                                    onClick={handleCopyReferral}
                                    className="text-xs text-[#A78BFA] hover:text-white transition"
                                >
                                    {copiedRef ? <FaCheck className="h-3 w-3 text-[#22C55E]" /> : <FaCopy className="h-3 w-3" />}
                                </button>
                            )}
                        </div>
                        <p className="text-sm font-bold font-mono text-[#A78BFA]">
                            {user?.referral_code || 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Edit Form Fields */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B85A3]">Personal Details</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#F4F2FB]">First Name</label>
                            <input
                                type="text"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                disabled={!editing}
                                placeholder="Enter first name"
                                className="w-full rounded-2xl border border-[#221E2F] bg-[#1A1626] py-3.5 px-4 text-sm font-semibold text-[#F4F2FB] placeholder-[#6F6A83] focus:border-[#7C5CF0] focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#F4F2FB]">Last Name</label>
                            <input
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                disabled={!editing}
                                placeholder="Enter last name"
                                className="w-full rounded-2xl border border-[#221E2F] bg-[#1A1626] py-3.5 px-4 text-sm font-semibold text-[#F4F2FB] placeholder-[#6F6A83] focus:border-[#7C5CF0] focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#F4F2FB]">Email Address</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full rounded-2xl border border-[#221E2F] bg-[#1A1626]/50 py-3.5 px-4 text-sm font-semibold text-[#8B85A3] cursor-not-allowed"
                        />
                        <p className="text-[11px] text-[#6F6A83]">Email address cannot be modified directly for security reasons.</p>
                    </div>

                    {editing && (
                        <div className="pt-2 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditing(false);
                                    setSelectedImage(null);
                                    setImagePreview(null);
                                }}
                                className="rounded-2xl border border-[#221E2F] bg-[#1A1626] px-6 py-3.5 text-xs font-semibold text-[#8B85A3] transition hover:bg-[#221E2F] hover:text-[#F4F2FB]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 rounded-2xl bg-[#7C5CF0] px-6 py-3.5 text-xs font-semibold text-white shadow-lg shadow-[#7C5CF0]/30 transition hover:bg-[#6A49E0] active:scale-[0.99] disabled:opacity-50"
                            >
                                <FaSave className="h-4 w-4" />
                                <span>{saving ? 'Updating Profile...' : 'Save Profile Changes'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}