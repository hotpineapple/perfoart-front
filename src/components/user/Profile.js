
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const AUTH_SERVER_URL = process.env.REACT_APP_AUTH_SERVER_URL;
    const [profile, setProfile] = useState({});

    const token = localStorage.getItem('access_token');
    if(!token) window.location.href = '/';
    
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const { data } = await axios.get(`${AUTH_SERVER_URL}/user/me`, { headers: {'Authorization': 'Bearer ' + token }});
        setProfile(data);
    };

    return (
        <div className="wrapper">
            <div className='profileGroup'>
                <h4>내 정보</h4>
                <div className="profileImgBox">
                    <img src={profile.imageUrl}/> 
                </div>
                <div className="profileInfo">{profile.email}</div>
                <div className="profileInfo">{profile.name}</div>
            </div>
        </div>
    );
};

export default Profile;
