import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../../img/logo.png'

export default function Header() {
    const token = localStorage.getItem('access_token');
    
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        window.alert("로그아웃 되었습니다.");
        window.location.href = "/";
    };

    return (
        <div className='headerWrapper'>
            <Navbar expand="lg">
                <Container style={{paddingLeft: "0"}}>
                    <Navbar.Brand href="/">
                        <img style={{ width: "80px", height: "auto"}} src={logo}/>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/exhibition">공연/전시</Nav.Link>
                            {token ? (
                                <>
                                    <NavDropdown title="마이페이지" id="basic-nav-dropdown">
                                        <NavDropdown.Item href="/mypage/profile">내 정보</NavDropdown.Item>
                                        <NavDropdown.Item href="/mypage/alarm">키워드 알람</NavDropdown.Item>
                                        <NavDropdown.Item href="/mypage/like">좋아요 목록</NavDropdown.Item>
                                    </NavDropdown>
                                    <Nav.Link onClick={handleLogout}>로그아웃</Nav.Link>
                                </> 
                            ):(
                                <Nav.Link href="/login">로그인</Nav.Link>
                            ) }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}