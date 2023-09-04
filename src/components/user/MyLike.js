
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyLike = () => {
    const RESTAPI_SERVER_URL = process.env.REACT_APP_RESTAPI_SERVER_URL;
    const [exhibitionList, setExhibitionList] = useState([]);

    const token = localStorage.getItem('access_token');
    if(!token) window.location.href = '/';
    
    useEffect(() => {
        fetchMyLike();
    }, []);

    const fetchMyLike = async () => {
        const likedExhibitions = (await axios.get(`${RESTAPI_SERVER_URL}/like/${token}`)).data;
        if (likedExhibitions) setExhibitionList(likedExhibitions.map(exhibition => ({...exhibition, isLike: true})));
    };

    return (
        <div className="wrapper">
            <div className="alarmGroup">
                <h4>좋아요 목록</h4>
                <table style={{marginTop:"30px"}}>
                    <thead>
                        <tr><th></th><th></th></tr>
                    </thead>
                    <tbody>
                        {exhibitionList.map(exhibition => (
                            <tr key={exhibition.id}>
                                <td><img style={{width:"60px", height:"80px"}}src={exhibition.thumbnail}/></td>
                                <td><Link to={`/exhibition/${exhibition.seq}`} state = {{ exhibition }} >{exhibition.title}</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyLike;
