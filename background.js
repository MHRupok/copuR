///////////////////////////////// INJECTED TABS ///////////////////////////////////
let injected_tabs = [];
///////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////// INSTALLING ////////////////////////////////////
chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.sync.set({ 'isRunning': false }, function () {
		
	});
	// initiate chrome memory for text
	chrome.storage.sync.set({ 'text': "\n" }, function () {  
		console.log("text created!");
	});
	// initiate local memory for text so that text can be saved after refresh
	window.localStorage.setItem('texts', " ");

});
/////////////////////////////////////////////////////////////////////////////////

//////////////////////////// ACTIVE FROM PLUGINS ////////////////////////////////
chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.storage.sync.get('isRunning', function (data) {
		var isRunning = data.isRunning;
		if (isRunning) {
			chrome.storage.sync.set({ 'isRunning': false }, function () {
				chrome.browserAction.setIcon({ path: 'off.png' });

			});
		}
		else {
			chrome.storage.sync.set({ 'isRunning': true }, function () {
				chrome.browserAction.setIcon({ path: '/on.png' });
				if (injected_tabs.includes(tab.id)) {
					console.log("return kortese");
					return;
				}

				else {
					injected_tabs.push(tab.id)
					chrome.tabs.executeScript(null, { file: "contentScript.js" });
				}
			});
		}

	});


});
///////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////// TAB UPDATE ////////////////////////////////////
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	injected_tabs = injected_tabs.filter(item => item !== tabId)
	chrome.storage.sync.set({ 'isRunning': false }, function () {
		console.log('The isRunning is set to false.');
		chrome.browserAction.setIcon({ path: 'off.png' });
	});

});
//////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////// NEW TAB //////////////////////////////////////
chrome.tabs.onCreated.addListener(function (tab) {
	chrome.storage.sync.set({ 'isRunning': false }, function () {
		console.log('The isRunning is set to false.');
		chrome.browserAction.setIcon({ path: 'off.png' });
	});


});
//////////////////////////////////////////////////////////////////////////////////

//////////////////////////////// ACTIVE TAB //////////////////////////////////////
chrome.tabs.onActivated.addListener(function (info) {
	chrome.storage.sync.get('isRunning', function (data) {
		var isRunning = data.isRunning;
		if (isRunning) {
			if (injected_tabs.includes(info.tabId)) {
				return;
			}
			else {
				injected_tabs.push(info.tabId)
				chrome.tabs.get(info.tabId, function (tab) {
					console.log(tab.url);
					fireScript(tab);
				});
			}
		}
	});


});
//////////////////////////////////////////////////////////////////////////////////



//////////////////////////////// FOR FIRING /////////////////////////////////////

function fireScript(tab) {
	var url = new URL(tab.url);

	if (url.protocol != 'chrome:') {
		chrome.storage.sync.get('isRunning', function (data) {
			var isRunning = data.isRunning;
			console.log('testscript injected in new tab ');
			console.log('The isRunning is set to true.');

			chrome.tabs.executeScript(null, { file: "contentScript.js" });

		});
	}
}

//////////////////////////////////////////////////////////////////////////////////
