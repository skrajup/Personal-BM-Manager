console.log("pupup script");
const addToBm = document.querySelector("#addToBm");
var activeTab;

chrome.runtime.sendMessage({
    role: "ROLE_SERVICE_WORKER",
    key: 1,
    isPopupOpen: true
}).then(res=>{
    console.log(res);
}).catch(err => {
    console.log(err);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // match listener key = 2
    if(message.role === "ROLE_POPUP" && message.key === 1){
        console.log(message);
        activeTab = message.data;
    }else{
        console.log("active tab not received by popup");
    }
});

addToBm.addEventListener("click", (e)=>{
    console.log("addtobm clicked");
    
    const title = activeTab[0].title;
    const url = activeTab[0].url;
    const faviconUrl = activeTab[0].favIconUrl;

    chrome.storage.local.get("bookmarks", (result)=>{
        const data = result.bookmarks;

        data.push({
            title: title,
            url: url,
            faviconUrl: faviconUrl
        });

        chrome.storage.local.set({bookmarks: data}, ()=>{
            console.log("new bookmark added to the localstorage.");
            
            chrome.runtime.sendMessage({
                role: "ROLE_NEWTAB",
                key: 1,
                action: "RELOAD"
            }).then(res=>{
                console.log(res);
            }).catch(err=>{
                console.log(err);
            });
        });

    });
});