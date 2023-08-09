console.log("service worker");

// Fired when the extension is first installed
const details = {reason: "install"};
chrome.runtime.onInstalled.addListener((details)=>{
    console.log("extension installed.");
    const items = {
        bookmarks: []
    };
    chrome.storage.local.set(items, ()=>{
        console.log("keys are set in localstorage.");
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    if(message.role === "ROLE_SERVICE_WORKER" && message.key === 1 && message.isPopupOpen){
        console.log("isPopupOpen: "+message.isPopupOpen);
        getCurrentTab()
        .then(tab=>{
            console.log(tab)
            console.log("message sent");
            chrome.runtime.sendMessage({
                role: "ROLE_POPUP",
                key: 1,
                data: tab
            });
        })
        .catch(err => {
            console.log(err);
        })
        sendResponse("response from background to get the tab");
    }
});

// chrome.runtime.sendMessage({
//     key: 1,
//     data: getCurrentTab().then(tab=>tab).catch(err=>err),
//     message: "active tab response got from service worker."
// }).then(res => {
//     console.log(chrome.runtime.lastError);
//     console.log(res);
// }).catch(err => {
//     console.log(err);
// });

function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let tab = chrome.tabs.query(queryOptions);
    return tab;
}