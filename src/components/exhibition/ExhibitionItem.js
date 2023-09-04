import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FilterContext from './FilterContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faCalendar, faWonSign, faTag, faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons"
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons"

const ExhibitionItem = ({ exhibition }) => {
    const RESTAPI_SERVER_URL = process.env.REACT_APP_RESTAPI_SERVER_URL;
    const token = localStorage.getItem('access_token')
    const [newExhibition, setNewExhibition] = useState(exhibition);
    const { setIsHistory, setScrollY }  = useContext(FilterContext);

    const handleGotoDetail = () => {
        setIsHistory(true);
        // console.log(window.scrollY)
        setScrollY(window.scrollY);
    }

    const handleLike = async (seq) => {
        if (!token) {
            if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?') === true) window.location.href = "/login";
        } else {
            try {
                await axios.patch(`${RESTAPI_SERVER_URL}/like`, { seq, token, op: "add"});
                const newLikeCount = (await axios.get(`${RESTAPI_SERVER_URL}/like-count/${seq}`)).data;
                setNewExhibition({ ...newExhibition, likeCount: newLikeCount, isLike: true });
            } catch (e) {
                window.alert('서버 오류가 발생했습니다', e)
            }
        }  
    }

    const handleUnLike = async (seq) => {
        if (!token) {
            if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?') === true) window.location.href = "/login";
        } else {
            try {
                await axios.patch(`${RESTAPI_SERVER_URL}/like`, { seq, token, op: "cancel"})
                const newLikeCount = (await axios.get(`${RESTAPI_SERVER_URL}/like-count/${seq}`)).data;
                setNewExhibition({ ...newExhibition, likeCount: newLikeCount, isLike: false });
            } catch (e) {
                window.alert('서버 오류가 발생했습니다', e)
            }
        }
    }

    return(
        <li key={newExhibition.seq}>
            <div className='imgBox'>
                <Link to={`/exhibition/${newExhibition.seq}`} state = {{ exhibition: newExhibition }} >
                    <img src={newExhibition.thumbnail} alt="thumbnail" onClick={handleGotoDetail}/>
                </Link>
            </div>
            <div className='non-imgBox'>
                <div className='titleBox'>
                    <Link to={`/exhibition/${newExhibition.seq}`} state = {{ exhibition: newExhibition }} onClick={handleGotoDetail} style={{ color: "black" }}>
                        {newExhibition.title}
                    </Link>
                </div>
                <div className='otherBox'>
                    <div className='infoBox'>
                        <div>
                            <FontAwesomeIcon icon={faTag} />
                            {" "}
                            <span>{newExhibition.realmName}</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faCalendar} />
                            {" "}
                            <span>{newExhibition.startDate} ~ {newExhibition.endDate}</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faWonSign} />
                            {" "}
                            <span>{newExhibition.price}</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faLocationDot} />
                            {" "}
                            <span>{newExhibition.place}</span>
                        </div> 
                    </div>
                    <div className='likeBox'>
                        <div>
                            {newExhibition.isLike ? (
                                <FontAwesomeIcon style={{color: "rgb(243,23,45)", fontSize:"large", cursor: "pointer" }} icon={fullHeart} onClick={() => handleUnLike(exhibition.seq)}/>
                            ) : (
                                <FontAwesomeIcon style={{color: "rgb(243,23,45)", fontSize:"large", cursor: "pointer" }} icon={emptyHeart} onClick={() => handleLike(exhibition.seq)}/>
                            )}
                        </div>
                        <div>
                            {newExhibition.likeCount >= 1000000 ? "1M+" : (newExhibition.likeCount >= 1000 ? Math.floor(newExhibition.likeCount/1000) + "k" : newExhibition.likeCount)}
                        </div>
                    </div>
                </div>
            </div>   
        </li> 
    )
}

export default ExhibitionItem;
