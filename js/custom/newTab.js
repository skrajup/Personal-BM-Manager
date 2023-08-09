const form = document.querySelector("form");
const bmLink = document.querySelector("a");
const bmbox = document.querySelector(".bm-box");
// console.log(chrome.runtime.lastError);
chrome.storage.local.get("bookmarks", (result)=>{
    const data = result.bookmarks;
    for(let i = 0; i < data.length; i++){
        const bookmark = data[i];
        
        const title = bookmark.title;
        const url = bookmark.url;
        const faviconUrl = bookmark.faviconUrl;

        // favicon
        const faviconDiv = document.createElement("div");
        faviconDiv.classList.add("d-flex", "px-2", "align-items-center");
        const img = document.createElement("img");
        img.src = faviconUrl;
        img.alt = "favicon";
        img.style.width = "40px";
        img.style.height = "40px";
        img.style.borderRadius = "100%";
        faviconDiv.appendChild(img);

        const item = document.createElement("div");
        item.classList.add("flex-wrap", "d-flex", "flex-basis-25", "flex-grow-1", "border", "border-black", "item");
        const purja1 = document.createElement("div");
        purja1.classList.add("flex-fill", "d-flex", "px-2", "align-items-center", "title-div");
        const purja2 = document.createElement("div");
        purja2.classList.add("d-flex", "align-items-center", "rmv-btn-div");
        const btn = document.createElement("button");
        btn.classList.add("btn", "btn-danger", "bm-rmv-btn");

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
});

form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const title = form.title.value;
    const url = form.url.value;
    const faviconUrl = "../images/bmIcon64.png"; 

    const faviconDiv = document.createElement("div");
    faviconDiv.classList.add("d-flex", "px-2", "align-items-center");
    const img = document.createElement("img");
    img.src = faviconUrl;
    img.alt = "bookmark";
    img.style.width = "40px";
    img.style.height = "40px";
    img.style.borderRadius = "100%";
    faviconDiv.appendChild(img);


    const item = document.createElement("div");
    item.classList.add("flex-wrap", "d-flex", "flex-basis-25", "flex-grow-1", "border", "border-black", "item");
    const purja1 = document.createElement("div");
    purja1.classList.add("flex-fill", "d-flex", "px-2", "align-items-center", "title-div");
    const purja2 = document.createElement("div");
    purja2.classList.add("d-flex", "align-items-center", "rmv-btn-div");
    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-danger", "bm-rmv-btn");

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
                            console.log("bookmarks updated.");
                            document.location.reload();
                        });
                        console.log("bookmark removed.");
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