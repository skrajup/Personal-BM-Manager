"use strict";

const form = document.querySelector("form");
const bmLink = document.querySelector("a");
const bmbox = document.querySelector(".bm-box");

const faviconHeight = "20px",   faviconWidth = "20px";

chrome.storage.local.get("bookmarks", (result)=>{
    const data = result.bookmarks;
    for(let i = 0; i < data.length; i++){
        const bookmark = data[i];

        const bookmarkParams = {
            title: bookmark.title,
            url: bookmark.url,
            faviconUrl: bookmark.faviconUrl
        };

        appendBookmarkToNewTab(bookmarkParams);
    }
});

form.addEventListener("submit", (e)=>{
    e.preventDefault();

    const title = form.title.value;
    const url = form.url.value;
    const faviconUrl = "../images/bmIcon64.png"; 

    const bookmarkParams = {
        title: title,
        url: url,
        faviconUrl: faviconUrl
    };

    appendBookmarkToNewTab(bookmarkParams);

    // push into localstorage
    chrome.storage.local.get("bookmarks", (result)=>{
        const data = result.bookmarks;

        data.push({
            title: title,
            url: url,
            faviconUrl: faviconUrl
        });
        chrome.storage.local.set({bookmarks: data}, ()=>{
            console.log("new bookmark added to the localstorage.");
        });
    });

    form.reset();
});

bmbox.addEventListener("click", (e)=>{
    const isItRemoveBtn = e.target.classList.contains("bm-rmv-btn");
    if(isItRemoveBtn){
        const urlKey = e.target.parentElement.previousElementSibling.firstChild.href;
        if(urlKey){
            chrome.storage.local.get("bookmarks", (result)=>{
                const data = result.bookmarks;
                for(let i = 0; i < data.length; i++){
                    if(data[i].url === urlKey){
                        data.splice(i, 1);
                        chrome.storage.local.set({bookmarks: data}, ()=>{
                            document.location.reload();
                        });
                        break;
                    }
                }
            });
        }
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    if(message.role==="ROLE_NEWTAB" && message.key===1){
        if(message.action === "RELOAD"){
            document.location.reload();
        }
    }
});

// append a bookmark to new tab UI
function appendBookmarkToNewTab(bookmarkParams) {
    const title = bookmarkParams.title;
    const url = bookmarkParams.url;
    const faviconUrl = bookmarkParams.faviconUrl;

    // favicon
    const faviconDiv = document.createElement("div");
    faviconDiv.classList.add("d-flex", "px-2", "align-items-center");
    const img = document.createElement("img");
    img.src = faviconUrl;
    img.alt = "favicon";
    img.style.width = faviconWidth;
    img.style.height = faviconHeight;
    faviconDiv.appendChild(img);

    const item = document.createElement("div");
    item.classList.add("flex-wrap", "d-flex", "flex-basis-25", "flex-grow-1", "item");
    const purja1 = document.createElement("div");
    purja1.classList.add("flex-fill", "d-flex", "align-items-center", "title-div");
    const purja2 = document.createElement("div");
    purja2.classList.add("d-flex", "align-items-center", "rmv-btn-div");
    const btn = document.createElement("button");
    btn.classList.add("bm-rmv-btn");

    const a = document.createElement("a");
    a.classList.add("bmLink");
    const titleTextNode = document.createTextNode(title);
    a.href = url;
    a.target = "_blank";
    a.appendChild(titleTextNode);


    purja1.appendChild(a);
    btn.innerHTML = `&#9932;`;
    purja2.appendChild(btn);

    item.appendChild(faviconDiv);
    item.appendChild(purja1);
    item.appendChild(purja2);

    bmbox.appendChild(item);
}