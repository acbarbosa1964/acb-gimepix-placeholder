// This is example of a client for extenstion online tracking service
// Part of Brackets Extension Rating extension by Alex Bardanov
// https://github.com/dnbard/brackets-extension-rating

// use require('./onlineTrackingClient').init() to activate tracking

define(function(require, exports){
    var trackingServiceUrl = 'http://online-dnbard.rhcloud.com/',
        appToken = '5620f410e59615263f000006',
        mins60 = 60 * 60 * 1000,
        mins5 = 5 * 60 * 1000,
        keyId = 'ext-online-id';

    function tick(){
        var userId = getUserId(appToken, keyId),
            url;

        if (userId){
            url = trackingServiceUrl + 'tick/' + appToken + '/' + userId;
        } else {
            url = trackingServiceUrl + 'tick/' + appToken;
        }

        $.ajax({ url: url })
            .success(function(data){
                //TODO: create complex model of data in local storage to support any number of extensions
                if (data && data !== 'OK' && data !== 'ERROR'){
                    saveUserId(data, appToken, keyId);
                }
            }).error(function(){
                console.log('Can\'t track online status, retry in 5 mins');
                setTimeout(tick, mins5);
            });
    }

    function init(){
        tick();
        setInterval(tick, mins60);
    }

    function getUserId(appToken, keyId){
        if (typeof appToken !== 'string' || typeof keyId !== 'string'){
            throw new Error('Invalid argument');
        }

        return JSON.parse(localStorage.getItem(keyId) || '{ }')[appToken];
    }

    function saveUserId(id, appToken, keyId){
        if (typeof id !== 'string' || typeof appToken !== 'string' || typeof keyId !== 'string'){
            throw new Error('Invalid argument');
        }

        var obj = JSON.parse(localStorage.getItem(keyId) || '{ }');
        obj[appToken] = id;
        localStorage.setItem(keyId, JSON.stringify(obj));
    }

    exports.init = init;
});
