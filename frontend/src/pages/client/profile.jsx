import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import avatar from '../../assets/default_pfp.png';
import tokenLogo from '../../assets/token_logo.png';
import Button from '../../components/common/Button';

const Profile = () => {
    const navigate = useNavigate();
    const { user, tokens, logout } = useAuth();
    const [showPopup, setShowPopup] = useState(false);
    const [localUser, setLocalUser] = useState(user);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', email: '' });
    
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

    useEffect(() => {
        if (user) setLocalUser(user);
    }, [user]);

    const handleLogout = () => {
        if (logout) logout();
        navigate('/login');
    };

    const handleEditClick = () => {
        setEditData({ 
            name: localUser?.name || '', 
            email: localUser?.email || '' 
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        setLocalUser({ ...localUser, name: editData.name, email: editData.email });
        setIsEditing(false);
    };

    const handlePasswordSave = () => {
        if (passwordData.new !== passwordData.confirm) {
            alert("New passwords do not match!");
            return;
        }
        alert("Password successfully updated!");
        setIsChangingPassword(false);
        setPasswordData({ current: '', new: '', confirm: '' });
    };

    return (
        <div className="min-h-screen bg-[#f4f9fc] px-[5%] py-[50px] font-sans">
            <div className="flex flex-wrap justify-center gap-[30px]">
                
                <div className="w-full max-w-[450px] rounded-[20px] border border-[#D1ECFF] bg-white p-10 shadow-[0_15px_35px_rgba(30,84,112,0.1)] transition-transform hover:-translate-y-1">
                    <div className="relative mx-auto mb-4 h-[120px] w-[120px] overflow-hidden rounded-full border-4 border-[#D1ECFF] shadow-[0_4px_15px_rgba(52,114,156,0.2)]">
                        <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
                    </div>
                    <div className="mb-6 flex items-center justify-between border-b border-[#f0f7ff] pb-2">
                        <h2 className="text-xl font-bold text-[#1E5470]">Personal Information</h2>
                        {!isEditing && (
                            <button onClick={handleEditClick} className="text-sm font-semibold text-[#34729c] hover:underline">
                                ✎ Edit
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[0.9rem] font-bold text-[#1E5470]">Full Name</label>
                                <input 
                                    type="text"
                                    className="rounded-xl border-2 border-[#e1e9f5] bg-[#f9fbff] px-4 py-2.5 outline-none focus:border-[#6EC1D1]"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}/>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[0.9rem] font-bold text-[#1E5470]">Email Address</label>
                                <input 
                                    type="email"
                                    className="rounded-xl border-2 border-[#e1e9f5] bg-[#f9fbff] px-4 py-2.5 outline-none focus:border-[#6EC1D1]"
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}/>
                            </div>
                            <div className="mt-4 flex gap-3">
                                <button onClick={() => setIsEditing(false)} className="flex-1 rounded-xl bg-gray-100 py-3 font-bold text-gray-600">Cancel</button>
                                <button onClick={handleSave} className="flex-1 rounded-xl bg-[#1E5470] py-3 font-bold text-white shadow-md">Save</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#1E5470]">Full Name</label>
                                <p className="text-[#555]">{localUser?.name || "User Unavailable"}</p>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#1E5470]">Email Address</label>
                                <p className="text-[#555]">{localUser?.email || "Email Unavailable"}</p>
                            </div>
                            <div className="w-full">
                                {!isChangingPassword ? (
                                    <button 
                                        onClick={() => setIsChangingPassword(true)}
                                        className="w-full rounded-xl border-2 border-[#D1ECFF] bg-white py-2.5 text-sm font-bold text-[#1E5470] transition-all hover:bg-[#f0f8ff]">
                                        Change Password
                                    </button>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-[#D1ECFF] bg-[#f9fbff] p-4">
                                        <h3 className="mb-3 text-sm font-bold text-[#1E5470]">Update Security</h3>
                                        <div className="flex flex-col gap-3">
                                            <input 
                                                type="password" 
                                                placeholder="Current Password" 
                                                className="w-full rounded-lg border border-[#e1e9f5] px-3 py-2 text-sm outline-none focus:border-[#6EC1D1]"
                                                value={passwordData.current}
                                                onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}/>
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
                    )}
                </div>
                <div className="flex h-fit w-full max-w-[450px] flex-col justify-between rounded-[20px] border border-[#D1ECFF] bg-white p-10 shadow-[0_15px_35px_rgba(30,84,112,0.1)]">
                    <h2 className="mb-6 border-b border-[#f0f7ff] pb-2 text-xl font-bold text-[#1E5470]">Wasalni Wallet</h2>
                    <div className="my-4 flex items-center justify-center rounded-[15px] bg-[#f0f8ff] p-6">
                        <img src={tokenLogo} alt="token" className="mr-4 h-[50px] w-[50px] object-cover [clip-path:circle(46%)]" />
                        <div className="flex flex-col">
                            <span className="text-[2rem] font-extrabold leading-none text-[#1E5470]">
                                {tokens?.toLocaleString() || 0}
                            </span>
                            <span className="text-sm font-semibold text-[#34729c]">Available Tokens</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/packages')}
                        className="mt-6 w-full rounded-xl bg-[#6EC1D1] py-4 font-bold text-white shadow-lg transition-all hover:bg-[#5bb0c0]">
                        Add Tokens
                    </button>
                </div>
            </div>

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