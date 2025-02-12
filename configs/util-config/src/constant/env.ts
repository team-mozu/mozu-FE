const isLocalhost = window.location.href.includes('localhost');
// const isStag = window.location.href.includes('stag');

export const COOKIE_DOMAIN = isLocalhost ? 'localhost' : '여기에 모주도메인';

export const MAIN_URL = process.env.REACT_APP_MAIN_URL;

export const ADMIN_AUTH_URL = process.env.REACT_APP_ADMIN_AUTH_URL;

export const STUDENT_AUTH_URL = process.env.REACT_APP_STUDENT_AUTH_URL;

export const ADMIN_URL = process.env.REACT_APP_ADMIN_URL;

export const SERVER_URL = process.env.REACT_APP_SERVER_URL;
