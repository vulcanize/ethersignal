# Ether Signal

Contract on Testnet:
http://testnet.etherscan.io/address/0x9e75993a7a9b9f92a1978bcc15c30cbcb967bc81#code

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

To test with Protractor:
webdriver-manager start
protractor conf.js

geth --rpc --rpccorsdomain="*" --rpcapi="db,eth,net,web3,personal" --testnet