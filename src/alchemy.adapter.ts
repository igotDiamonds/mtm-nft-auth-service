import { Network, Alchemy } from 'alchemy-sdk';

const ALCHEMY_API_KEY = 'J9uG1JXJKtfeqQzRZKsAN4-he0ARz3gS';

const ALCHEMY_NETWORK = Network.MATIC_MAINNET;

export const alchemy = new Alchemy({
  apiKey: ALCHEMY_API_KEY,
  network: ALCHEMY_NETWORK,
});
