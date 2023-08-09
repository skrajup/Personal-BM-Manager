
// Fired when the extension is first installed
const details = {reason: "install"};
chrome.runtime.onInstalled.addListener((details)=>{
    const items = {
        bookmarks: []
    };
    chrome.storage.local.set(items);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    if(message.role === "ROLE_SERVICE_WORKER" && message.key === 1 && message.isPopupOpen){
        getCurrentTab()
        .then(tab=>{
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

function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let tab = chrome.tabs.query(queryOptions);
    return tab;
}