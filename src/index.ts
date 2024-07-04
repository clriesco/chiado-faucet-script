import axios from 'axios';
import { TWOCAPTCHA_API_KEY, wallets } from './config';
import { Proxy, getProxies } from './proxy';

// TwoCaptcha configuration
import TwoCaptcha from '2captcha';
const solver = new TwoCaptcha.Solver(TWOCAPTCHA_API_KEY);

// Wallet addresses

async function requestTokens(proxy: Proxy, wallet: string) {
  try {
    const proxyConfig = {
      protocol: 'http',
      host: proxy.proxy_address,
      port: proxy.port,
      auth: {
        username: proxy.username,
        password: proxy.password,
      },
    };
    const headers: any = {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    };

    // Obtaining the CSRF request ID and token address
    console.log(
      `Requesting tokens for wallet ${wallet} with proxy ${proxy.proxy_address}`
    );
    const infoResponse = await axios.get(
      'https://api.faucet.chiadochain.net/api/v1/info',
      { headers, proxy: proxyConfig }
    );
    const csrfRequestId = infoResponse.data.csrfRequestId;
    const csrfToken = infoResponse.data.csrfToken;
    const csrfTimestamp = infoResponse.data.csrfTimestamp;
    const tokenAddress = infoResponse.data.enabledTokens[0].address;

    console.log(
      `Received CSRF request ID ${csrfRequestId} and token address ${tokenAddress}`
    );
    console.log('Solving captcha...');
    const captchaResponse = await solver.hcaptcha(
      'e8b64be8-4e47-4f73-a85a-a37f65ffe5ed',
      'https://faucet.chiadochain.net',
      {
        proxy: `${proxy.username}:${proxy.password}@${proxy.proxy_address}:${proxy.port}`,
        proxytype: 'http',
      }
    );
    console.log('Captcha solved:', captchaResponse);

    const captcha = captchaResponse.data;

    const postData = {
      recipient: wallet,
      captcha: captcha,
      tokenAddress: tokenAddress,
      chainId: 10200,
      amount: 1,
      requestId: csrfRequestId,
      timestamp: csrfTimestamp,
    };
    headers['X-Csrftoken'] = csrfToken;
    headers['Content-Type'] = 'application/json';
    headers['Referer'] = 'https://faucet.chiadochain.net/';
    headers['Origin'] = 'https://faucet.chiadochain.net/';
    headers['Accept'] = 'application/json, text/plain, */*';

    console.log('Requesting tokens...');
    const tokenResponse = await axios.post(
      'https://api.faucet.chiadochain.net/api/v1/ask',
      postData,
      { headers, proxy: proxyConfig }
    );
    console.log(
      `Tokens sent to wallet ${wallet} with proxy ${proxy.proxy_address}:`,
      tokenResponse.data
    );
  } catch (error) {
    console.error(
      `Error requesting tokens for wallet ${wallet} with proxy ${proxy.proxy_address}:`,
      error
    );
  }
}

(async () => {
  const proxies = await getProxies();

  for (let i = 0; i < wallets.length; i++) {
    const proxy = proxies[i];
    const wallet = wallets[i];
    await requestTokens(proxy, wallet);
  }
})();