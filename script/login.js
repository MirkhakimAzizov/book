"use strict";

function $(selector, parrent = document) {
    return parrent.querySelector(`${selector}`);
}

$('.login__form').addEventListener('submit', evt => {
    evt.preventDefault();
    let username = $('.login-username').value;
    let pass = $('.login-password').value;

    console.log(pass, username);

})

async function loginData() {
    const data = fetch(`https://reqres.in/api/login`);
    const res = await data;
    console.log(res);
}