# Ether Signal

Contract on Testnet:
http://testnet.etherscan.io/address/0x851a78f09511bf510ad27036f5ff7c8901fdd2e2#code


## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

To test with Protractor:
webdriver-manager start
protractor conf.js

geth --rpc --rpccorsdomain="*" --rpcapi="db,eth,net,web3,personal" --testnet