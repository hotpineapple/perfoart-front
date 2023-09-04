import googleLogo from '../../img/google-logo.png'

export default function Login() {
    const AUTH_SERVER_URL = process.env.REACT_APP_AUTH_SERVER_URL;
    const SERVER_URL = process.env.REACT_APP_SERVER_URL;
    const token = localStorage.getItem('access_token');
    if(token) window.location.href = '/';
    
    const url = `${AUTH_SERVER_URL}/oauth2/authorize/google?redirect_uri=${SERVER_URL}/oauth2/redirect`;
    
    return (
        <>
            <div className="wrapper">
                <div className="loginGroup">
                    <h4>로그인</h4>
                    <h6>로그인하여 회원전용 서비스를 이용해보세요.</h6>
                    <div className="loginButtonGroup">
                        <a className="loginButton" href={url}>
                            <div className="imgBox" >
                                <img src={googleLogo} alt="Google" />
                            </div>
                            <div className="textBox">Log in with Google</div>
                        </a>
                    </div>
                </div>
            </div>
            
        </>
    )
}