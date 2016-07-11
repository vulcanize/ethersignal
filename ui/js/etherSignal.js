//TODO move this out of global scope
var to = '0x3B0C2BA7A03725E0f9aC5a55CB813823053d5eBE';
var isMist = typeof web3 !== 'undefined';
if(typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {
        // If there's a web3 library loaded, then make your own web3
        web3 = new Web3(web3.currentProvider);
    } else if (typeof Web3 !== 'undefined') {
        // If there isn't then set a provider
        //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        web3 = new Web3(new Web3.providers.HttpProvider("https://signal.ether.ai/proxy"));
    } else if(typeof web3 == 'undefined' && typeof Web3 == 'undefined') {
        // If there is neither then this isn't an ethereum browser
    }
var connected = web3.currentProvider.isConnected();
console.log("Connection status: ", connected);

var app = angular.module('ethSignal', []);
