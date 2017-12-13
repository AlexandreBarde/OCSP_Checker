chrome.runtime.sendNativeMessage('date_getter', {"url": "reddit.com"}, (response) => {
    console.log('Recu ' + response);
});
