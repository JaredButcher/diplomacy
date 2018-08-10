/**
 * Handles cookies
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/cookies
 */

 /**
  * @param {string} cookie - Name of cookie
  * @returns {string} Value of cookie
  */
function getCookie(cookie){
    if(navigator.cookieEnabled){
        let name = cookie + '=';
        let decoded = decodeURI(document.cookie);
        let cookies = decoded.split("; ");
        for(let i = 0; i < cookies.length; i++){
            if(cookies[i].indexOf(name) == 0){
                return cookies[i].substr(name.length, cookies[i].length);
            }
        }
    } else {
        alert("This site relies on cookies, please enable cookies.");
    }
    console.error("Cookie " + cookie + " not found");
    return "";
}

export {getCookie};