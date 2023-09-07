import React, { useState, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons"
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons"

const ExhibitionDetail = () => {
  const RESTAPI_SERVER_URL = process.env.REACT_APP_RESTAPI_SERVER_URL;
  const token = localStorage.getItem('access_token')
  const { state } = useLocation();
  if(!state) window.location.href = '/';
  const { exhibition }  = state;

  const [likeCount, setLikeCount] = useState(exhibition.likeCount);
  const [isLike, setIsLike] = useState(exhibition.isLike);

  const handleLike = async (seq) => {
    if (!token) {
      if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?') === true) window.location.href = "/login";
    } else {
      try {
          await axios.patch(`${RESTAPI_SERVER_URL}/like`, { seq, token, op: "add"});
          const newLikeCount = (await axios.get(`${RESTAPI_SERVER_URL}/like-count/${seq}`)).data;
          setLikeCount(newLikeCount);
          setIsLike(true);
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
          setLikeCount(newLikeCount);
          setIsLike(false);
      } catch (e) {
          window.alert('서버 오류가 발생했습니다', e)
      }
    }
  }

  return (
    <>
      <div className="wrapper">
        <div className="exhibitionDetailBox">
          <table>
            <thead>
            </thead>
            <tbody>
            <tr>
              <th>전시명</th>
              <td className='title'>{exhibition.title}</td>
              <th>일자</th>
              <td>{(exhibition.startDate).replaceAll("-", ".")} ~ {(exhibition.endDate).replaceAll("-", ".")}</td>
            </tr>
            <tr>
              <th>분야</th>
              <td>{exhibition.realmName}</td>
              <th>가격</th>
              <td>{exhibition.price}</td>
            </tr>
            <tr>
              <th>주소</th>
              <td>{exhibition.place}{exhibition.placeAddr ? (" (" + exhibition.placeAddr + ")") : ''}</td>
              <th>TEL</th>
              <td>{exhibition.phone}</td>
            </tr>
            <tr>
              <th valign="center">이미지</th>
              <td colSpan={3}><a href={exhibition.placeUrl} title="링크로 이동" target="_blank" rel="noopener noreferrer"><img src={exhibition.imgUrl} alt={exhibition.title} style={{ maxWidth: '100%' }} /></a></td>
            </tr>
            {exhibition.subTitle ? (
              <tr>
                <th>부제</th>
                <td colSpan={3}>{exhibition.subTitle}</td>
              </tr>
              ):<></>
            }
            {exhibition.content1 ? (
              <tr>
                <th>설명</th>
                <td colSpan={3}>{exhibition.content1}</td>
              </tr>
              ):<></>
            }
            {exhibition.content2 ? (
              <tr>
                <th>설명2</th>
                <td colSpan={3}>{exhibition.content2}</td>
              </tr>
              ):<></>
            }
            </tbody>
          </table>
          <div className='likeBox'>
              {isLike ? (
                  <FontAwesomeIcon style={{color: "rgb(243,23,45)", fontSize:"large"}} icon={fullHeart} onClick={() => handleUnLike(exhibition.seq)}/>
              ) : (
                  <FontAwesomeIcon style={{color: "rgb(243,23,45)", fontSize:"large"}} icon={emptyHeart} onClick={() => handleLike(exhibition.seq)}/>
              )}
              {" "}
              {likeCount >= 1000000 ? "1M+" : (likeCount >= 1000 ? Math.floor(likeCount/1000) + "k" : likeCount)}
          </div>
          <div className='buttonGroup'>
            <Link to="/exhibition">
              <Button variant="outline-dark">
                목록으로 가기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExhibitionDetail;
