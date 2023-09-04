
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

const MyAlarm = () => {
    const RESTAPI_SERVER_URL = process.env.REACT_APP_RESTAPI_SERVER_URL;
    const [alarms, setAlarms] = useState([]);

    const token = localStorage.getItem('access_token');
    if(!token) window.location.href = '/';
    
    useEffect(() => {
        fetchMyAlarm();
    }, []);

    const fetchMyAlarm = async () => {
        const res = await axios.get(`${RESTAPI_SERVER_URL}/alarm/${token}`);
        setAlarms(res.data);
    };

    const handleAlarmEnable = async (alarmId) => {
        if (window.confirm('알람을 켜시겠습니까?') === true) {
            await axios.patch(`${RESTAPI_SERVER_URL}/alarm/${alarmId}?op=enable`)
            fetchMyAlarm();
        }
    }

    const handleAlarmDisable = async (alarmId) => {
        if (window.confirm('알람을 끄시겠습니까?') === true) {
            await axios.patch(`${RESTAPI_SERVER_URL}/alarm/${alarmId}?op=disable`)
            fetchMyAlarm();
        }
    }

    const handleAlarmRemove = async (alarmId) => {
        if (window.confirm('알람을 삭제하시겠습니까?') === true) {
            await axios.delete(`${RESTAPI_SERVER_URL}/alarm/${alarmId}`)
            fetchMyAlarm();
        }
    }

    return (
        <div className="wrapper">
            <div className="alarmGroup">
                <h4>키워드 알람</h4>
                <h6>키워드는 비활성화 항목을 포함하여 10개까지 등록 가능합니다.</h6>
                <table>
                    <thead>
                        <tr><th></th><th></th><th></th></tr>
                    </thead>
                    <tbody>
                        {alarms.map(alarm => (
                            <tr key={alarm.id}>
                                {alarm.enabled ? <td>{alarm.keyword}</td> : <td className="disabled">{alarm.keyword}</td>}
                                <td>{
                                    alarm.enabled ? 
                                    <Button variant="outline-secondary" size="sm" onClick={() => handleAlarmDisable(alarm.id)}>끄기</Button> 
                                    : <Button variant="outline-secondary" size="sm" onClick={() => handleAlarmEnable(alarm.id)}>켜기</Button>
                                }</td>
                                <td><Button variant="outline-danger" size="sm" onClick={() => handleAlarmRemove(alarm.id)}>삭제</Button> </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyAlarm;
