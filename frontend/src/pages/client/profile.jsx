import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import avatar from '../../assets/default_pfp.png';
import tokenLogo from '../../assets/token_logo.png';
import { changePassword, getUserInfo, updateProfile } from '../../api/auth';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout, setUser, loading: authLoading } = useAuth();
    const [showPopup, setShowPopup] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ first_name: '', last_name: '', email: '' });
    const [editError, setEditError] = useState('');
    const [editSuccess, setEditSuccess] = useState('');

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const refreshUserData = useCallback(async () => {
        if (user?.id || user?.user_id) {
            const userId = user.id || user.user_id;
            try {
                setDataLoading(true);
                const freshInfo = await getUserInfo(userId);
                setUser(prev => ({ ...prev, ...freshInfo }));
                setEditData({ 
                    first_name: freshInfo.first_name || '', 
                    last_name: freshInfo.last_name || '',
                    email: freshInfo.email || ''
                });
            } catch (err) {
                console.error('Failed to refresh profile info', err);
            } finally {
                setDataLoading(false);
            }
        }
    }, [user?.id, user?.user_id, setUser]);

    useEffect(() => {
        if (!authLoading && user) {
            refreshUserData();
        }
    }, [authLoading, user?.id, user?.user_id, refreshUserData]);

    const handleLogout = () => {
        if (logout) logout();
        navigate('/login');
    };

    const handleProfileSave = async () => {
        setEditError('');
        setEditSuccess('');
        try {
            await updateProfile(editData);
            setEditSuccess("Profile updated successfully!");
            setUser(prev => ({ ...prev, ...editData }));
            setIsEditing(false);
            refreshUserData();
        } catch (err) {
            console.error('Profile update failed', err);
            setEditError(err?.response?.data?.error || 'Failed to update profile.');
        }
    };

    const handlePasswordSave = async () => {
        setPasswordError('');
        setPasswordSuccess('');
        if (passwordData.new !== passwordData.confirm) {
            setPasswordError("New passwords do not match!");
            return;
        }
        if (passwordData.new.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
            return;
        }
        try {
            await changePassword(passwordData.new);
            setPasswordSuccess("Password successfully updated!");
            setIsChangingPassword(false);
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (err) {
            console.error('Password change failed', err);
            setPasswordError(err?.response?.data?.error || 'Failed to update password.');
        }
    };

    if (authLoading || (!user && dataLoading)) {
        return (
            <div className="min-h-screen bg-[#f4f9fc] flex items-center justify-center font-sans">
                <div className="text-[#1E5470] font-bold text-xl animate-pulse">Loading Profile...</div>
            </div>
        );
    }

    const fullName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : "User Unavailable";

    return (
        <div className="min-h-screen bg-[#f4f9fc] px-[5%] py-[50px] font-sans">
            <div className="flex flex-wrap justify-center gap-[30px]">
                
                {/* Personal Information Card */}
                <div className="w-full max-w-[450px] rounded-[20px] border border-[#D1ECFF] bg-white p-10 shadow-[0_15px_35px_rgba(30,84,112,0.1)] transition-transform hover:-translate-y-1">
                    <div className="relative mx-auto mb-4 h-[120px] w-[120px] overflow-hidden rounded-full border-4 border-[#D1ECFF] shadow-[0_4px_15px_rgba(52,114,156,0.2)]">
                        <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
                    </div>
                    
                    <div className="mb-6 flex items-center justify-between border-b border-[#f0f7ff] pb-2">
                        <h2 className="text-xl font-bold text-[#1E5470]">Personal Information</h2>
                        {!isEditing && (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="text-sm font-bold text-[#6EC1D1] hover:text-[#5bb0c0]">
                                Edit
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col gap-5">
                        {!isEditing ? (
                            <>
                                <div>
                                    <label className="mb-1 block text-sm font-bold text-[#1E5470]">Full Name</label>
                                    <p className="text-[#555] font-medium">{fullName || "User Unavailable"}</p>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-bold text-[#1E5470]">Email Address</label>
                                    <p className="text-[#555] font-medium">{user?.email || "Email Unavailable"}</p>
                                </div>
                            </>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-top-2 flex flex-col gap-4">
                                {editError && <p className="text-xs font-semibold text-red-500">{editError}</p>}
                                <div>
                                    <label className="mb-1 block text-sm font-bold text-[#1E5470]">First Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full rounded-lg border border-[#e1e9f5] px-3 py-2 text-sm outline-none focus:border-[#6EC1D1]"
                                        value={editData.first_name}
                                        onChange={(e) => setEditData({...editData, first_name: e.target.value})}/>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-bold text-[#1E5470]">Last Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full rounded-lg border border-[#e1e9f5] px-3 py-2 text-sm outline-none focus:border-[#6EC1D1]"
                                        value={editData.last_name}
                                        onChange={(e) => setEditData({...editData, last_name: e.target.value})}/>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-bold text-[#1E5470]">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="w-full rounded-lg border border-[#e1e9f5] px-3 py-2 text-sm outline-none focus:border-[#6EC1D1]"
                                        value={editData.email}
                                        onChange={(e) => setEditData({...editData, email: e.target.value})}/>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setIsEditing(false)} className="flex-1 rounded-lg bg-gray-200 py-2 text-sm font-bold text-gray-600">Cancel</button>
                                    <button onClick={handleProfileSave} className="flex-1 rounded-lg bg-[#6EC1D1] py-2 text-sm font-bold text-white">Save</button>
                                </div>
                            </div>
                        )}

                        <div className="w-full pt-2">
                            {!isChangingPassword ? (
                                <button 
                                    onClick={() => setIsChangingPassword(true)}
                                    className="w-full rounded-xl border-2 border-[#D1ECFF] bg-white py-2.5 text-sm font-bold text-[#1E5470] transition-all hover:bg-[#f0f8ff]">
                                    Update Security
                                </button>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-[#D1ECFF] bg-[#f9fbff] p-4">
                                    <h3 className="mb-3 text-sm font-bold text-[#1E5470]">Change Password</h3>
                                    {passwordError && <p className="mb-2 text-xs font-semibold text-red-500">{passwordError}</p>}
                                    {passwordSuccess && <p className="mb-2 text-xs font-semibold text-green-600">{passwordSuccess}</p>}
                                    <div className="flex flex-col gap-3">
                                        <input 
                                            type="password" 
                                            placeholder="New Password" 
                                            className="w-full rounded-lg border border-[#e1e9f5] px-3 py-2 text-sm outline-none focus:border-[#6EC1D1]"
                                            value={passwordData.new}
                                            onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}/>
                                        <input 
                                            type="password" 
                                            placeholder="Confirm New Password" 
                                            className="w-full rounded-lg border border-[#e1e9f5] px-3 py-2 text-sm outline-none focus:border-[#6EC1D1]"
                                            value={passwordData.confirm}
                                            onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}/>
                                        <div className="mt-1 flex gap-2">
                                            <button onClick={() => setIsChangingPassword(false)} className="flex-1 rounded-lg bg-gray-200 py-2 text-xs font-bold text-gray-600">Cancel</button>
                                            <button onClick={handlePasswordSave} className="flex-1 rounded-lg bg-[#6EC1D1] py-2 text-xs font-bold text-white">Save</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-2 flex flex-col gap-3">
                            <button 
                                onClick={() => navigate('/active-tickets')}
                                className="w-full rounded-xl border-2 border-[#1E5470] py-3 font-bold text-[#1E5470] transition-all hover:bg-[#1E5470] hover:text-white">
                                View Active Tickets
                            </button>
                            <button 
                                onClick={() => navigate('/history')}
                                className="w-full rounded-xl border-2 border-[#1E5470] py-3 font-bold text-[#1E5470] transition-all hover:bg-[#1E5470] hover:text-white">
                                Ticket History
                            </button>
                            <button 
                                onClick={() => navigate('/refundRequest')}
                                className="w-full rounded-xl border-2 border-[#6EC1D1] py-3 font-bold text-[#6EC1D1] transition-all hover:bg-[#6EC1D1] hover:text-white">
                                View Refunding Requests
                            </button>
                            <button 
                                onClick={() => setShowPopup(true)}
                                className="mt-2 text-sm font-bold text-red-500 hover:text-red-700">
                                Log out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Wallet Card */}
                <div className="flex h-fit w-full max-w-[450px] flex-col justify-between rounded-[20px] border border-[#D1ECFF] bg-white p-10 shadow-[0_15px_35px_rgba(30,84,112,0.1)]">
                    <h2 className="mb-6 border-b border-[#f0f7ff] pb-2 text-xl font-bold text-[#1E5470]">Wasalni Wallet</h2>
                    <div className="my-4 flex items-center justify-center rounded-[15px] bg-[#f0f8ff] p-6">
                        <img src={tokenLogo} alt="token" className="mr-4 h-[50px] w-[50px] object-cover [clip-path:circle(46%)]" />
                        <div className="flex flex-col">
                            <span className="text-[2.2rem] font-extrabold leading-none text-[#1E5470]">
                                {user?.token_balance?.toLocaleString() || 0}
                            </span>
                            <span className="text-sm font-semibold text-[#34729c] mt-1">Available Tokens</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/packages')}
                        className="mt-6 w-full rounded-xl bg-[#6EC1D1] py-4 font-bold text-white shadow-lg transition-all hover:bg-[#5bb0c0]">
                        Add Tokens
                    </button>
                </div>
            </div>

            {/* Logout Confirmation Popup */}
            {showPopup && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-[400px] rounded-[20px] bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="mb-2 text-2xl font-bold text-[#1E5470]">Sign Out</h3>
                        <p className="mb-8 text-[#718096]">Are you sure you want to disconnect from your Wasalni account?</p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowPopup(false)} className="flex-1 rounded-xl bg-gray-100 py-3 font-bold text-gray-600 hover:bg-gray-200">Cancel</button>
                            <button onClick={handleLogout} className="flex-1 rounded-xl bg-red-500 py-3 font-bold text-white hover:bg-red-600 shadow-md">Disconnect</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
