// To get the current tab
browser.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {

    // Get URL
    var url = tabs[0].url;

    // Update info alert
    updateSiteState(url, true);

});

// Events related to click
document.addEventListener("click", function(e) {
    // Follow Site button
    if (e.target.classList.contains("notfollowed")) {
        browser.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            addSite(tabs[0].url, 20);
            updateSiteState(tabs[0].url, false);
        });
    // Unfollow Site button
    } else if (e.target.classList.contains("followed")) {
        browser.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            removeSite(tabs[0].url, 20);
            updateSiteState(tabs[0].url, false);
        });
    // Unfollow All Sites button
    } else if (e.target.classList.contains("unstorage")) {
        browser.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            removeAllSites();
            updateSiteState(tabs[0].url, false);
        });
    }
});