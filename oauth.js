import crypto from "crypto";

export const genCodeVerifier = (len = 112) => {
    const dec2hex = (dec) => dec.toString(16).padStart("0", 2);
    const array = new Uint32Array(~~(len / 4));
    crypto.getRandomValues(array);
    return Array.from(array, dec2hex).join("");
};

console.log(genCodeVerifier());

export const getGoogleAuthCode = (options, defaultOptions = {
    redirect_uri: "https://navime.knockdata.com",
    prompt: "consent",
    response_type: "code",
    client_id: "358598792733-ng3fbhdm4tptci7uudk9kj8ush262ren.apps.googleusercontent.com",
    scope: "https://www.googleapis.com/auth/devstorage.read_only",
    access_type: "offline"
}) => {
    const authUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const params = new URLSearchParams({...defaultOptions, ...options});
    return `${authUrl}?${params.toString()}`;
};

console.log(getGoogleAuthCode({redirect_uri: "http://localhost:3030"}));