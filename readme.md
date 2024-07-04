# Chiado Faucet Script

This project is a TypeScript script designed to interact with the Chiado Gnosis Chain faucet web through proxies. The script obtains Gnosis tokens for a series of wallet addresses using the TwoCaptcha service to solve captchas.

## Requirements

- Node.js (version 16 or higher)
- NPM (version 6 or higher)

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/clriesco/chiado-faucet-script.git
   cd chiado-faucet-script
   ```

2. Install the project dependencies:

   ```bash
    npm install
   ```

## Configuration

1. Rename the example.env file to .env and configure the following variables:

    ```bash
    WEBSHARE_API_KEY=your_webshare_api_key
    TWOCAPTCHA_API_KEY=your_2captcha_api_key
    ```
2. Make sure to update the wallets array in the src/config.ts file with your wallet addresses.

## Usage
### Compile the Project
Compile the TypeScript code to JavaScript:

```bash
npx tsc
```

### Run the Script
Run the compiled script:

```bash
npm start
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.