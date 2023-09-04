import React, { createContext, useState, useMemo } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [isHistory, setIsHistory] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedArea, setSelectedArea] = useState('all-area');
    const [selectedPlace, setSelectedPlace] = useState('all-place');
    const [selectedRealm, setSelectedRealm] = useState('all-realm');
    const [isFreeChecked, setIsFreeChecked] = useState(false);
    const [exceptExpiredChecked, setExceptExpiredChecked] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [selectedSort, setSelectedSort] = useState('최신등록순');
    const [scrollY, setScrollY] = useState(0);

    const contextValue = useMemo(
        () => ({
            isHistory, currentPage, selectedArea, selectedPlace, selectedRealm, isFreeChecked, exceptExpiredChecked, keyword, selectedSort, scrollY,
            setIsHistory, setCurrentPage, setSelectedArea, setSelectedPlace, setSelectedRealm, setIsFreeChecked, setExceptExpiredChecked, setKeyword, setSelectedSort, setScrollY  
        }),
        [isHistory, currentPage, selectedArea, selectedPlace, selectedRealm, isFreeChecked, exceptExpiredChecked, keyword, selectedSort, scrollY,
            setIsHistory, setCurrentPage, setSelectedArea, setSelectedPlace, setSelectedRealm, setIsFreeChecked, setExceptExpiredChecked, setKeyword, setSelectedSort, setScrollY]
    );

    return (
        <FilterContext.Provider value={contextValue}>
            {children}
        </FilterContext.Provider>
    );
};

export default FilterContext;
