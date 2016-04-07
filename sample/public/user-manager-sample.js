// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

///////////////////////////////
// UI event handlers
///////////////////////////////
document.getElementById('clearState').addEventListener("click", clearState, false);
document.getElementById('getUser').addEventListener("click", getUser, false);

document.getElementById('startSigninMainWindow').addEventListener("click", startSigninMainWindow, false);
document.getElementById('endSigninMainWindow').addEventListener("click", endSigninMainWindow, false);
document.getElementById('popupSignin').addEventListener("click", popupSignin, false);
document.getElementById('iframeSignin').addEventListener("click", iframeSignin, false);

document.getElementById('startSignoutMainWindow').addEventListener("click", startSignoutMainWindow, false);
document.getElementById('endSignoutMainWindow').addEventListener("click", endSignoutMainWindow, false);

///////////////////////////////
// config
///////////////////////////////
IdentityModel.Log.logger = console;
IdentityModel.Log.logLevel = IdentityModel.Log.INFO;

var settings = {
    authority: 'http://localhost:5000/oidc',
    client_id: 'js.tokenmanager',
    redirect_uri: 'http://localhost:5000/user-manager-sample.html',
    post_logout_redirect_uri: 'http://localhost:5000/user-manager-sample.html',
    response_type: 'id_token token',
    scope: 'openid email roles',
    
    popup_redirect_uri:'http://localhost:5000/user-manager-sample-popup.html',
    popup_post_logout_redirect_uri:'http://localhost:5000/user-manager-sample-popup-signout.html',
    
    silent_redirect_uri:'http://localhost:5000/user-manager-sample-silent.html',
    silent_post_logout_redirect_uri:'http://localhost:5000/user-manager-sample-silent-signout.html',
    enableSilentRedirect:true,

    filterProtocolClaims: true,
    loadUserInfo: true
};
var mgr = new IdentityModel.UserManager(settings);

///////////////////////////////
// functions for UI elements
///////////////////////////////
function clearState(){
    mgr.clearStaleState().then(function(){
        log("clearStateState success");
    }, function(e){
        log("clearStateState error", e.message);
    });
}

function getUser() {
    mgr.getUser(null).then(function(user) {
        log("got user", user);
    }, function(err) {
        log(err);
    });
}

function startSigninMainWindow() {
    mgr.signinRedirect({data:'some data'}).then(function() {
        log("signinRedirect done");
    }, function(err) {
        log(err);
    });
}

function endSigninMainWindow() {
    mgr.signinRedirectCallback().then(function(user) {
        log("signed in", user);
    }, function(err) {
        log(err);
    });
}

function popupSignin() {
    mgr.signinPopup({data:'some data'}).then(function(user) {
        log("signed in", user);
    }, function(err) {
        log(err);
    });
}

function iframeSignin() {
    mgr.signinSilent({data:'some data'}).then(function(user) {
        log("signed in", user);
    }, function(err) {
        log(err);
    });
}

function startSignoutMainWindow(){
    mgr.signoutRedirect({data:'some data'}).then(function(resp) {
        log("signed out", resp);
    }, function(err) {
        log(err);
    });
};

function endSignoutMainWindow(){
    mgr.signoutRedirectCallback().then(function(resp) {
        log("signed out", resp);
    }, function(err) {
        log(err);
    });
};


///////////////////////////////
// debugging helpers
///////////////////////////////
function log() {
    document.getElementById('out').innerText = '';

    Array.prototype.forEach.call(arguments, function(msg) {
        if (msg instanceof Error){
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== 'string') {
            msg = JSON.stringify(msg, null, 2);
        }
        document.getElementById('out').innerHTML += msg + '\r\n';
    });
}
