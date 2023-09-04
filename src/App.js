import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import ExhibitionList from './components/exhibition/ExhibitionList';
import NotFound from './components/common/NotFound';
import ExhibitionDetail from './components/exhibition/ExhibitionDetail';
import OAuth2RedirectHandler from './components/user/OAuth2RedirectHandler';
import Login from './components/user/Login'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { FilterProvider } from './components/exhibition/FilterContext';
import MyAlarm from './components/user/MyAlarm';
import Profile from './components/user/Profile';
import MyLike from './components/user/MyLike';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <FilterProvider>
          <Routes>
            <Route path="/" element={<ExhibitionList />}></Route>
            <Route path="/exhibition/:seq" element={<ExhibitionDetail />}></Route>
            <Route path="/exhibition/*" element={<ExhibitionList />}></Route>
            <Route path="/mypage/profile" element={<Profile />}></Route>
            <Route path="/mypage/alarm" element={<MyAlarm />}></Route>
            <Route path="/mypage/like" element={<MyLike />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />}></Route>
            <Route path="*" element={<NotFound />}></Route>  
          </Routes>
      </FilterProvider>
    </BrowserRouter>
  );
}

export default App;
