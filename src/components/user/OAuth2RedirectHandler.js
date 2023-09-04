/**
 * 참고: https://github.com/callicoder/spring-boot-react-oauth2-social-login-demo/blob/master/react-social
 */

const OAuth2RedirectHandler = async () => {
    const getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(window.location.search);

        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const token = getUrlParameter('token');
    const error = getUrlParameter('error');

    if (token) {
        localStorage.setItem('access_token', token);
    } else if (error) {
        window.alert(error)
    }
    window.location.href = "/";
}

export default OAuth2RedirectHandler;