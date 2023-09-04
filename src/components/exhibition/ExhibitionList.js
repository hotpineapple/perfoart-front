import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import NoResult from './NoResult'
import FilterContext from './FilterContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from "@fortawesome/free-solid-svg-icons"
import { useInView } from 'react-intersection-observer';
import ExhibitionItem from './ExhibitionItem';
import InputGroup from 'react-bootstrap/InputGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Link } from 'react-router-dom';

const ExhibitionList = () => {
    const regexp = /^[가-힣a-zA-Z\s]{1,100}$/;
    const RESTAPI_SERVER_URL = process.env.REACT_APP_RESTAPI_SERVER_URL;
    const { isHistory, currentPage, selectedArea, selectedPlace, selectedRealm, isFreeChecked, exceptExpiredChecked, keyword, selectedSort, scrollY,
        setIsHistory, setCurrentPage, setSelectedArea, setSelectedPlace, setSelectedRealm, setIsFreeChecked, setExceptExpiredChecked, setKeyword, setSelectedSort, setScrollY }  = useContext(FilterContext);
    // console.log(currentPage, selectedArea, selectedPlace, selectedRealm, isFreeChecked, exceptExpiredChecked, keyword, selectedSort) 
    const [exhibitionData, setExhibitionData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [exhibitionsPerPage] = useState(10);
    const [totalArea, setTotalArea] = useState([]);
    const [totalPlace, setTotalPlace] = useState([]);
    const [totalRealm, setTotalRealm] = useState([]);
    const [keywordTemp, setKeywordTemp] = useState(keyword);
    const [hotExhibitions, setHotExhibitions] = useState([]);
    const totalSort = {};
    totalSort['최신등록순'] = { sortBy: 'seq', sortOrder: 'desc' };
    totalSort['과거등록순'] = { sortBy: 'seq', sortOrder: 'asc' };
    totalSort['가나다순'] = { sortBy: 'title', sortOrder: 'asc' };
    const [ref, inView] = useInView();
    const [overwrite, setOverwrite] = useState(true);
    
    const token = localStorage.getItem('access_token')

    useEffect(() => {
        // console.log('first loaded')
        fetchTotalArea();
        fetchTotalRealm();
        fetchHotExhibitions();
    }, []);
    
    useEffect(() => {
        // console.log('selectedArea changes')
        if(isHistory) return;
        setSelectedPlace('all-place');
        fetchTotalPlace();
    }, [selectedArea]);

    useEffect(() => {
        // console.log('arrive bottom')
        if(inView && currentPage < totalPages) {
            setOverwrite(false)
            setCurrentPage(currentPage + 1);
            // fetchExhibitionData();
        }
    }, [inView])

    useEffect(() => {
        // console.log('others changes')
        fetchTotalPages();
        setOverwrite(true)
        // 1. 이전 필터 기록을 가져오는 경우에는 아래 코드를 수행하지 않음 (즉, 페이지값을 그대로 가져옴)
        if(isHistory) {
            // setIsHistory(false);
            return; 
        }

        // 2. 그렇지 않은 경우에는 필터조건이 바뀌면 1페이지부터 시작함
        if (currentPage === 1) {
            fetchExhibitionData();
        }
        else {
            setCurrentPage(1);
            // fetchExhibitionData(true);
        }
    }, [selectedArea, selectedPlace, selectedRealm, isFreeChecked, exceptExpiredChecked, keyword, selectedSort]);

    useEffect(() => {
        // console.log('currentPage changes')
        fetchExhibitionData();
    }, [currentPage]);

    const fetchTotalPages = async () => {
        if(keyword !== '' && !regexp.test(keyword)) {
            window.alert("한글과 영문 대소문자, 공백만 입력가능합니다.");
            return;
        }

        if(selectedPlace.includes("&")) selectedPlace.replace("&","%26");
        
        try {
            let url = `${RESTAPI_SERVER_URL}/exhibition-count?isFree=${isFreeChecked}`;

            if (selectedArea !== 'all-area') url += `&area=${selectedArea}`;
            if (selectedPlace !== 'all-place') url += `&place=${selectedPlace}`
            if (selectedRealm !== 'all-realm') url += `&realm=${selectedRealm}`
            if (keyword !== '') url += `&keyword=${keyword}`
            if (exceptExpiredChecked) url += `&endAfter=${nowDate()}`
            // console.log(url)
            const response = await axios.get(url);
            setTotalPages(Math.ceil(response.data / exhibitionsPerPage));
        } catch (error) {
            console.error('Error fetching total pages:', error);
        }
    };

    const fetchHotExhibitions = async () => {
        try {
            let likedExhibitions;
            if(token) {
                likedExhibitions = (await axios.get(`${RESTAPI_SERVER_URL}/like/${token}`)).data;
            }
            const hotExhibitions = (await axios.get(`${RESTAPI_SERVER_URL}/exhibition-hot`)).data;
            if(likedExhibitions) setHotExhibitions(hotExhibitions.map(data => ({ ...data, isLike: likedExhibitions.map(exhibition => exhibition.seq).includes(data.seq)})));
            else setHotExhibitions(hotExhibitions.map(data => ({ ...data, isLike: false})));
            
        } catch(e) {
            console.error(e);
        }
    }
    const fetchTotalArea = async () => {
        setTotalPlace([])
        try {
            const response = await axios.get(`${RESTAPI_SERVER_URL}/exhibition-area`);
            setTotalArea(response.data);
        } catch (error) {
            console.error('Error fetching total area:', error);
        }
    };

    const fetchTotalPlace = async () => {
        if(selectedArea === 'all-area') {
            setTotalPlace([]);
            return;
        }

        try {
            const response = await axios.get(`${RESTAPI_SERVER_URL}/exhibition-place?area=${selectedArea}`);
            setTotalPlace(response.data);
        } catch (error) {
            console.error('Error fetching total place:', error);
        }
    };

    const fetchTotalRealm = async () => {
        try {
            const response = await axios.get(`${RESTAPI_SERVER_URL}/exhibition-realm`);
            setTotalRealm(response.data);
        } catch (error) {
            console.error('Error fetching total realm:', error);
        }
    };

    const fetchExhibitionData = async () => {
        if(keyword !== '' && !regexp.test(keyword)) {
            window.alert("한글과 영문 대소문자, 공백만 입력가능합니다.");
            return;
        }

        if(selectedPlace.includes("&")) selectedPlace.replace("&","%26");

        try {
            let newData = [];
            if(isHistory) {
                // console.log('history')
                setIsHistory(false);
                for(let i=1; i<=currentPage; i++) {
                    newData = [...newData, ...((await axios.get(getUrl(i))).data)];
                }
            } else {
                // console.log('non-history')
                newData = (await axios.get(getUrl(currentPage))).data;
            }
            
            let likedExhibitions;
            if(token) {
                likedExhibitions = (await axios.get(`${RESTAPI_SERVER_URL}/like/${token}`)).data;
            }
            // console.log('likedExhibitions:',likedExhibitions)
            if(likedExhibitions) newData = newData.map(data => ({ ...data, isLike: likedExhibitions.map(exhibition => exhibition.seq).includes(data.seq)}));
            else newData = newData.map(data => ({ ...data, isLike: false}));

            if(overwrite) {
                // console.log('general filter')
                setExhibitionData(newData);

                setTimeout(() => {
                    window.scrollTo(0, scrollY);
                    setScrollY(0)
                },100);
            } else {
                // console.log('infinite scroll')
                setExhibitionData([...exhibitionData, ...newData])
            }
        } catch (error) {
            console.error('Error fetching exhibition data:', error);
        }
    };

    const getUrl = (page) => {
        let url = `${RESTAPI_SERVER_URL}/exhibition?page=${page - 1}&size=${exhibitionsPerPage}&sortBy=${totalSort[selectedSort].sortBy}&sortOrder=${totalSort[selectedSort].sortOrder}&isFree=${isFreeChecked}`

        if (selectedArea !== 'all-area') url += `&area=${selectedArea}`;
        if (selectedPlace !== 'all-place') url += `&place=${selectedPlace}`
        if (selectedRealm !== 'all-realm') url += `&realm=${selectedRealm}`
        if (keyword !== '') url += `&keyword=${keyword}`
        if (exceptExpiredChecked) url += `&endAfter=${nowDate()}`

        return url;
    }
    const nowDate = () => new Date().toISOString().slice(0, 10);
    
    const handleOnKeyPress = e => {
        if (e.key === 'Enter') {
          setKeyword(keywordTemp)
        }
      };

    const addAlarm = async (keyword) => {
        // const token = localStorage.getItem('access_token');
        
        if (!token) {
            if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?') === true) window.location.href = "/login";
        } else {
            if(keyword !== '' && !regexp.test(keyword)) {
                window.alert("한글과 영문 대소문자, 공백만 입력가능합니다.");
            }

            else if (window.confirm('키워드 메일 알림을 신청하시겠습니까?') === true) {
                try {
                    const res = await axios.post(`${RESTAPI_SERVER_URL}/alarm`, { token, keyword });
                    window.alert('등록 완료되었습니다.')
                } catch (e) {
                    if (e.code === "ERR_BAD_REQUEST") {
                        window.alert('키워드는 최대 10개만 등록가능합니다.')
                    }
                    else window.alert('서버 오류가 발생했습니다.');
                } 
            }
        }
    };

    const handleClickPlace = () => {
        if(selectedArea === 'all-area' && totalPlace.length === 0) window.alert('지역을 먼저 선택해주세요.');
    }

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            원하는 키워드가 포함된 전시가 업데이트 되면 메일로 알려드려요
        </Tooltip>
      );

    return (
        <div>
            <div className="searchGroup">
                <div className="wrapper">
                    <div className="searchInput">
                        <InputGroup className="mb-3">
                            <Form.Control type="text" placeholder="검색어 또는 키워드를 입력하세요" onChange={(e) => setKeywordTemp(e.target.value)} onKeyPress={handleOnKeyPress} value={keywordTemp}/>
                            <Button variant="light" id="button-addon2" onClick={() => {setKeywordTemp(''); setKeyword('');}}>
                                X
                            </Button>
                        </InputGroup>
                    </div>
                    <div className="searchButton">
                        <Button variant="dark" onClick={() => setKeyword(keywordTemp)}>
                            검색
                        </Button>
                    </div>
                    <div className="addAlarmButton">
                    <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}>
                        <Button variant="outline-dark" onClick={() => addAlarm(keywordTemp)}>
                            키워드알람{" "}<FontAwesomeIcon icon={faBell} />
                        </Button>
                    </OverlayTrigger>
                    </div>
                </div>        
            </div>
            <div className="wrapper">
                <div className="filterGroup">
                    <div className="selectGroup">
                        <div>
                            <div>지역</div>
                            <Form.Select onChange={(e) => setSelectedArea(e.target.value)} value={selectedArea}>
                                <option value="all-area">전국</option>
                                {totalArea.filter(area => area !== ' ').map(area => (<option key={area}>{area}</option>))}
                            </Form.Select >
                        </div>
                        <div>
                            <div>장소</div>
                            <Form.Select onChange={(e) => setSelectedPlace(e.target.value)} onClick={handleClickPlace} value={selectedPlace}>
                                <option value="all-place" >전체 장소</option>
                                {totalPlace.map(place => (<option key={place}>{place}</option>))}
                            </Form.Select >
                        </div>
                        <div>
                            <div>분야</div>
                            <Form.Select onChange={(e) => setSelectedRealm(e.target.value)} value={selectedRealm}>
                                <option value="all-realm">전체 분야</option>
                                {totalRealm.map(realm => (<option key={realm}>{realm}</option>))}
                            </Form.Select >
                        </div>
                    </div>
                    <div className="checkboxGroup">
                        <div>기타</div>
                        <div>
                            <Form.Check type="checkbox" label="무료전시" onChange={(e) => setIsFreeChecked(e.target.checked)} checked={isFreeChecked}/>
                        </div>
                        <div>
                            <Form.Check type="checkbox" label="지난전시 제외" onChange={(e) => setExceptExpiredChecked(e.target.checked)} checked={exceptExpiredChecked}/>
                        </div>
                    </div>
                    <hr/>
                    <div className="hot5Group">
                        <div style={{fontWeight: "bold", marginBottom: "10px"}}>인기 TOP 5</div>
                        <div>
                        {hotExhibitions.map((ex,idx) => (
                            <div key={ex.seq} style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace: "nowrap", marginBottom: "2px" }}>
                                <span>{idx+1}.</span>
                                {" "}
                                <Link to={`/exhibition/${ex.seq}`} state = {{ exhibition: ex }} style={{ color: "black" }}>
                                    {ex.title}
                                </Link>        
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='non-filterGroup'>
                    <div className="sortGroup">
                        <Form.Select onChange={(e) => setSelectedSort(e.target.value)} value={selectedSort}>
                        {Object.keys(totalSort).map((sort) => (
                            <option key={sort}>{sort}</option>
                            ))}
                        </Form.Select >
                    </div>
                    <div className="dataGroup">          
                        {exhibitionData.length > 0 ? (
                        <div className='exhibitionListGroup'> 
                            <ul>
                                {exhibitionData.map((exhibition) => (
                                    <ExhibitionItem key={exhibition.id} exhibition={exhibition} />
                                ))}
                                </ul>
                            <div className='lastItem' ref={ref}>마지막입니다.</div>
                        </div>
                        ) : <NoResult />}
                    </div>  
                </div>
            </div>
        </div>
        
    );
};

export default ExhibitionList;
