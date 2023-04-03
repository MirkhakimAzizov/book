"use strict";

function $(selector, parrent = document) {
    return parrent.querySelector(`${selector}`);
}

$('.login__form').addEventListener('submit', evt => {
    evt.preventDefault();
    let email = $('.login-username').value;
    let password = $('.login-password').value;

    // console.log(pass, username);
    fetch('https://reqres.in/api/login', {
        method: 'post',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: {
            'Content-type': 'Application/json',
        },
    }).then(res => res.json()).then(data => {
        console.log(data);
        localStorage.setItem('token', data.token);
        window.location.href = '../index.html';
    })

})