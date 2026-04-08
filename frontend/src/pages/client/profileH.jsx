import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import tokenLogo from '../../assets/token_logo.png';
import avatar from '../../assets/default_pfp.png'
import '../../App.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, tokens, logout } = useAuth();
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    // Local state to simulate profile updates since there is no backend hooked up
    const [localUser, setLocalUser] = useState(user);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', email: '' });

    React.useEffect(() => {
        if (user) setLocalUser(user);
    }, [user]);

    const handleLogout = () => {
        if (logout) logout();
        navigate('/login');
    };

    const handleEditClick = () => {
        setEditData({ name: localUser?.name || '', email: localUser?.email || '' });
        setIsEditing(true);
    };

    const handleSave = () => {
        setLocalUser({ ...localUser, name: editData.name, email: editData.email });
        setIsEditing(false);
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/*information*/}
                <div className="profile-card info-section">
                    <div className="profile-pic-wrapper">
                        <img src={avatar} alt="avatar" className="profile-avatar" />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ color: '#1E5470', margin: 0 }}>Personal Information</h2>
                        {!isEditing && (
                            <button className="back-btn" style={{ position: 'relative', fontSize: '0.9rem', color: '#3b759f' }} onClick={handleEditClick}>
                                ✎ Edit
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="edit-profile-form" style={{ marginBottom: '20px' }}>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ color: '#1E5470', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px' }}>Full Name</label>
                                <input
                                    className="input"
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ color: '#1E5470', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px' }}>Email Address</label>
                                <input
                                    className="input"
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                <button className="custom-btn cancel-btn" style={{ flex: 1, padding: '8px' }} onClick={() => setIsEditing(false)}>Cancel</button>
                                <button className="custom-btn" style={{ flex: 1, padding: '8px' }} onClick={handleSave}>Save</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="info-group">
                                <label>Full Name</label>
                                <p>{localUser?.name || "User Unavailable"}</p>
                            </div>

                            <div className="info-group">
                                <label>Email Address</label>
                                <p>{localUser?.email || "Email Unavailable"}</p>
                            </div>
                        </>
                    )}

                    <div className="ticket-button-group">
                        <button
                            className="custom-btn ticket-btn"
                            onClick={() => navigate('/active-tickets')}
                        >
                            View Active Tickets
                        </button>
                        <button
                            className="custom-btn ticket-btn"
                            onClick={() => navigate('/TicketHistory')}
                        >
                            Ticket History
                        </button>
                    </div>

                    <button className="custom-btn cancel-btn" style={{ width: '100%', marginTop: '10px' }} onClick={() => setShowPopup(true)}>
                        Log out
                    </button>
                </div>

                {/*wallet*/}
                <div className="profile-card wallet-section">
                    <h2 style={{ color: '#1E5470', marginBottom: '20px', textAlign: 'center' }}>Wasalni Wallet</h2>

                    <div className="wallet-display">
                        <img src={tokenLogo} alt="token" className="token-icon" style={{ clipPath: 'none', objectFit: 'contain' }} />
                        <div className="balance-info">
                            <span className="balance-amount">{tokens?.toLocaleString() || 0}</span>
                            <span style={{ display: 'block', fontSize: '0.9rem', color: '#7f8c8d' }}>Available Tokens</span>
                        </div>
                    </div>

                    <button className="custom-btn" style={{ width: '100%', padding: '12px', fontSize: '1.1rem' }} onClick={() => navigate('/packages')}>
                        Add Tokens
                    </button>
                </div>
            </div>

            {/*popup*/}
            {showPopup && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Sign Out</h3>
                        <p>Are you sure you want to disconnect from your Wasalni account?</p>
                        <div className="modal-actions" style={{ marginTop: '25px' }}>
                            <button className="custom-btn cancel-btn" onClick={() => setShowPopup(false)}>
                                Cancel
                            </button>
                            <button className="custom-btn confirm-btn" style={{ background: '#d9534f' }} onClick={handleLogout}>
                                Disconnect
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;