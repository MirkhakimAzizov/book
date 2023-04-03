"use strict";

let index = 0;
let sortName = 'newest';
let search = 'a'
const BASE_API = `https://www.googleapis.com/books/v1/volumes?q=${search}`;
const API_KEY = 'AIzaSyC4yceaVm_HLVyo9aSRzUmj6BlmvKdU8ks';
let PAGE_API = `+terms1&startIndex=`;
let SORT_API = `&orderBy=`;
let fragment = new DocumentFragment;
let data = [];
let bookmark = [];
let elCaruselInner;
let elBtn;
let p = 0;
let pageNumber;
let elList = $('.list');
let elBookmark = $('.bookmark__list');

async function dataBase(arr, api1, api2, api3 = sortName, func = renderUi) {
    const response = await fetch(`${BASE_API}${api1}${api2}&maxResults=6${SORT_API}${api3}`);
    const database = await response.json();
    arr = database.items;
    func(arr);
    pageNumber = database.totalItems;
    pagenation(pageNumber);
    moreInfo(arr);
    basket(arr);
    $('.header__text').textContent = `Showing ${pageNumber} Result(s)`;
}

dataBase(data, PAGE_API, index, sortName);
searchFun();

function renderUi(arr) {
    if (arr && arr.length > 0) {
        arr.forEach(item => {
                    let elLi = document.createElement('li');
                    elLi.setAttribute('class', 'card');
                    elLi.innerHTML = `
        <span class="m-4 card__img rounded-3">
            <img src="${`http://books.google.com/books/content?id=${item.id}&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api`}" class="card-img-top p-4 rounded-3" alt="${item.volumeInfo.title}">
        </span>
        <div class="card-body">
            <h5 class="card-title text-dark m-0" title="${item.volumeInfo.title}">${item.volumeInfo.title ? item.volumeInfo.title.slice(0,20) : 'not a title!'}...</h5>
            <p class="card-text m-0 p-0 py-1" title="${item.volumeInfo.authors}">${item.volumeInfo.authors ? item.volumeInfo.authors[0].slice(0,30) : 'not a autor!'}...</p>
            <span class="text d-block mb-2">${item.volumeInfo.publishedDate ? item.volumeInfo.publishedDate.slice(0,4) : 'not a date!'}</span>
            <div class="mb-1 d-flex gap-1 justify-content-between align-items-center">
                <button class="btn btn-warning text-dark w-50" data-basketId=${item.id}>Bookmark</button>
                <button style="background: rgba(13, 117, 255, 0.05)" class="btn btn-light text-primary w-50" data-modalId=${item.id} data-bs-toggle="modal" data-bs-target="#exampleModal">More Info</button>
            </div>
            <a href="${item.volumeInfo.previewLink}" class="btn btn-dark text-light w-100 mt-1" target="_blank">Read</a>
        </div>
        `
            fragment.append(elLi);
        });
        elList.innerHTML = '';
        elList.append(fragment);
    }
}

function $_(elementName, parrent = document) {
    return parrent.createElement(`${elementName}`);
}

function $(selector, parrent = document) {
    return parrent.querySelector(`${selector}`);
}

function $$(selector, parrent = document) {
    return parrent.querySelectorAll(`${selector}`);
}

function searchFun(arr = data, funt = dataBase) {
    $(".main-search").addEventListener('keyup', evt => {
        evt.preventDefault();
        let value = evt.target.value.trim();
        if (value) {
            elList.innerHTML = '';
            search = value;
            funt(arr, value);
        }
    });
}

/* =============== Pagenation function =============== */
function pagenation(number) {
    let n = Math.ceil(number / 6);

    let elPagenation = $_("div");
    elPagenation.setAttribute("class", "pagenation d-flex justify-content-start align-items-center gap-2");

    let elDiv = $_("div");
    let elCaruselInner = $_("div");
    let elNext = $_("button");
    let elPrev = $_("button");

    elNext.setAttribute("class", "pagenation__btn btn btn-light text-center d-flex justify-content-center align-items-center");
    elNext.textContent = ">>";
    elPrev.setAttribute("class", "pagenation__btn btn btn-light text-center d-flex justify-content-center align-items-center");
    elPrev.textContent = "<<";

    elDiv.setAttribute("class", "pagenation__box d-flex justify-content-start align-items-center");
    elCaruselInner.setAttribute("class", "pagenation__box__inner d-flex justify-content-start align-items-center");

    for (let i = 1; i <= n; i++) {

        let btn = $_("button");
        btn.dataset.page = `0`;
        btn.dataset.id = `${i}`;
        btn.setAttribute("class", "pagenation__btn pagenation__btn-n btn btn-light text-center d-flex justify-content-center align-items-center me-2");
        btn.textContent = `${i}`;
        elCaruselInner.append(btn);
    }

    elPagenation.append(elPrev);
    elDiv.append(elCaruselInner);
    elPagenation.append(elDiv);
    elPagenation.append(elNext);
    fragment.append(elPagenation);
    $(".pagenation").innerHTML = '';
    $(".pagenation").append(fragment);

}


/* =============== Pagenation btn =============== */
$(".pagenation").addEventListener("click", (evt) => {
    elCaruselInner = $(".pagenation__box__inner");
    elBtn = $$(".pagenation__btn-n");
    evt.preventDefault();
    if (evt.target.textContent === ">>") {
        p++;
        if (p > elBtn.length - 3) {
            p = elBtn.length - 3;
        }
        elCaruselInner.style.transform = `translateX(${-p*58}px)`;
    }
    if (evt.target.textContent === "<<") {
        p--;
        if (p < 0) {
            p = 0;
        }
        elCaruselInner.style.transform = `translateX(${-p*58}px)`;
    }
    if (evt.target.dataset.id) {
        index = (evt.target.dataset.id - 1) * 7;
        dataBase(data, PAGE_API, index, sortName);
    }
});

function moreInfo(arr) {
    elList.addEventListener('click', evt => {
                if (evt.target.dataset.modalid) {
                    let id = evt.target.dataset.modalid;
                    arr.forEach(item => {
                                if (item.id == id) {
                                    let authors = [];
                                    let categories = [];
                                    if (item.volumeInfo.authors) {
                                        item.volumeInfo.authors.forEach(author => {
                                            authors.push(`<span class="text-info d-block px-4 h6 py-2 ms-3 bg-info bg-opacity-25 rounded-pill">${author}</span>`)
                                        });
                                    } else {
                                        authors.push(' not a aouthors!');
                                    }
                                    if (item.volumeInfo.categories) {
                                        item.volumeInfo.categories.forEach(categori => {
                                            categories.push(`<span class="text-info d-block px-4 h6 py-2 ms-3 bg-info bg-opacity-25 rounded-pill">${categori}</span>`)
                                        });
                                    } else {
                                        categories.push(` not a category!`);
                                    }

                                    $('.modal-content').innerHTML = `

                    <div class="modal-header w-50 bg-light ms-auto border-0">
                        <h1 class="modal-title fs-5 h6" id="exampleModalLabel">${item.volumeInfo.title}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body d-flex justify-content-between align-items-center flex-column w-50 p-5 bg-white ms-auto">
                        <img class="rounded-5" width="200" src="${`http://books.google.com/books/content?id=${item.id}&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api`}" alt="${item.volumeInfo.title}">
                        <p class="modal-text py-3 m-0">${item.volumeInfo.description ? item.volumeInfo.description : 'not a description'}</p>
                        <ul class="modal-list list-unstyled d-flex flex-column gap-3 justify-content-start me-auto">
                            <li class="modal-item m-0 p-0 h6 d-flex flex-wrap justify-content-start align-items-center">Author:    
                                ${authors}
                            </li>
                            <li class="modal-item h6">Published:
                                <span class="text-info px-4 h6 py-2 ms-3 bg-info bg-opacity-25 rounded-pill">${item.volumeInfo.publishedDate ? item.volumeInfo.publishedDate.slice(0,4) : 'not a date!'}</span>
                            </li>
                            <li class="modal-item h6">Publishers:
                                <span class="text-info px-4 h6 py-2 ms-3 bg-info bg-opacity-25 rounded-pill">${item.volumeInfo.publisher ? item.volumeInfo.publisher : 'not a publisher'}</span>
                            </li>
                            <li class="modal-item h6  m-0 p-0 h6 d-flex flex-wrap justify-content-start align-items-center">Categories:
                                ${categories}
                            </li>
                            <li class="modal-item h6">Pages Count:
                                <span class="text-info px-4 h6 py-2 ms-3 bg-info bg-opacity-25 rounded-pill">${item.volumeInfo.pageCount ? item.volumeInfo.pageCount : 'not a pages count'}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="modal-footer border-0 bg-light w-50 ms-auto">
                        <a href="${item.volumeInfo.previewLink}" target="_blank" type="button" class="btn btn-dark bg-opacity-10">Read</a>
                    </div>
                `
                }
            })
        }
    })
}

function basket(arr){
    elList.addEventListener('click', evt=>{
        if(evt.target.dataset){
            let id = evt.target.dataset.basketid;
            arr.forEach(item=>{
                if(item.id==id && !bookmark.includes(item)){
                    bookmark.push(item);
                }
            })
            elBookmark.innerHTML = '';
            renderBookmark(bookmark);
        }
    });
}

function renderBookmark(arr){
    // $('.bookmark-title').textContent = `Bookmarks(${arr.length})`;
    arr.forEach(item=>{
        let elLi = $_('li');
        elLi.innerHTML = `
        <li style="background: #F8FAFD" class="w-100 d-flex justify-content-between align-items-center rounded-2 border-4 px-3 py-4">
            <div class="">
                <h2 class="card-title h4 mb-1" title="${item.volumeInfo.title}">${item.volumeInfo.title ? item.volumeInfo.title.slice(0,8) : 'not a title!'}</h2>
                <p class="card-text fs-6" title="${item.volumeInfo.authors}">${item.volumeInfo.authors ? item.volumeInfo.authors[0].slice(0,16) : 'not a autor!'}</p>
            </div>
            <div class="d-flex justify-content-between align-items-center gap-2">
                <a href="${item.volumeInfo.previewLink}" target="_blank" class="border-0 bg-transparent hover-zoom">
                    <img src="./images/book.svg" alt="book" width="32">
                </a>
                <button class="border-0 bg-transparent hover-zoom" data-id=${item.id}>
                    <img  data-id=${item.id} src="./images/delete.svg" alt="book" width="32">
                </button>
            </div>
        </li>
        `
        fragment.appendChild(elLi);
    });
    elBookmark.append(fragment);
}

elBookmark.addEventListener('click', evt=>{
    if(evt.target.dataset){
        let id = evt.target.dataset.id;
        bookmark.forEach(item=>{
            if(item.id==id){
                let index = bookmark.indexOf(item);
                bookmark.splice(index,index+1);
                elBookmark.innerHTML = '';
                renderBookmark(bookmark);
            }
        })
    }
});

$('#header__select').addEventListener('change', evt=>{
    evt.preventDefault();
    sortName = evt.target.value;
    dataBase(data, PAGE_API, index,sortName);
});