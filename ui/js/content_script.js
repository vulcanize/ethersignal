var port = chrome.runtime.connect();

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;
	if(event.data.type === 'chrome-ethereum')
	    port.postMessage({type:'chrome-ethereum'});
}, false);

  port.onMessage.addListener(function(msg) {
	if(msg.type === 'reply')	
		window.postMessage(msg, '*');
  });
