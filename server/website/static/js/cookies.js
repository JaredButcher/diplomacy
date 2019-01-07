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
    return null;
}

/**Creates a cookie
 * @param {String} name - Name of cookie
 * @param {String} value - value of cookie
 * @param {Number} days - days cookie is valid for, null for no experation data
 */
function setCookie(name, value, days){
    if(navigator.cookieEnabled){
        let experation = "";
        value = value || "";
        if(days){
            let date = new Date();
            date.setTime(date.getTime() + days * 86400000);
            experation = `; expires=${date.toUTCString()}`;
        }
        document.cookie = `${name}=${value}${experation}; path=/`;
    } else {
        alert("This site relies on cookies, please enable cookies.");
    }
}

/**Removes a cookie
 * @param {String} name - Name of cookie to remove
 */
function rmCookie(name){
    document.cookie = `${name}=; Max-Age=-9999999;`;
}

export {getCookie, setCookie, rmCookie};