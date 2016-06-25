//register the initChromeEthereum (Command+Shift+E) command to inject content_script.js
var Web3 = require('web3');
var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider());

chrome.commands.onCommand.addListener(function (command) {
  if(command === 'initChromeEthereum')
    chrome.tabs.executeScript(null, {file: "content_script.js"});
    //chrome.tabs.create({url:chrome.extension.getURL('editor.html')});

});

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
	if(msg.type === 'chrome-ethereum')
	      port.postMessage({type:"reply", msg:web3.eth.accounts});
  });
});
