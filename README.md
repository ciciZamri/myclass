# Template

## How to generate a random token
1. Open terminal and type this command to launch the Node shell.
```
node
```
2. Use built in crypto module to generate a random token.
3. Run the code below.
```
require('crypto').randomBytes(64).toString('hex');
```
4. Copy the token generated.