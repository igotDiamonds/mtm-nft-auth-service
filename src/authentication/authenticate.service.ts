import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { Injectable } from '@nestjs/common';
import { alchemy } from '../alchemy.adapter';
import { UserSessionService } from '../user-session/user-session.service';
import { WalletConnectService } from 'src/walletconnect/walletconnect.service';

@Injectable()
export class AuthenticateService {
  // private walletConnector: WalletConnect;
  // private walletAddress: string;
  // private onWalletConnectCallback: (ctx: WalletConnect, wallet: string) => void;
  // constructor(
  //   private userSessionService: UserSessionService,
  //   private walletConnectService: WalletConnectService,
  // ) {}
  // private async init() {
  //   const userSession = await this.userSessionService.getSession('123');
  //   console.log('User Session', userSession);
  //   const options = {
  //     bridge: 'https://bridge.walletconnect.org', // Required
  //     qrcodeModal: QRCodeModal,
  //     ...(userSession && {
  //       session: await JSON.parse(userSession.sessionJSON),
  //     }),
  //     clientMeta: {
  //       description: 'Server side auth',
  //       url: 'https://mtmart.io',
  //       name: 'MTM Auth',
  //       icons: [],
  //     },
  //   };
  //   this.walletConnector = new WalletConnect(options);
  //   // Check if connection is already established
  //   if (!this.walletConnector.connected) {
  //     // create new session
  //     this.walletConnector
  //       .createSession()
  //       .then(() => console.log(this.walletConnector.accounts || 'No accounts'))
  //       .catch((errors) =>
  //         console.log('WalletConnect - session error', errors),
  //       );
  //   } else {
  //     console.log('WalletConnect - already connected');
  //   }
  //   // Subscribe to connection events
  //   this.walletConnector.on('connect', (error, payload) => {
  //     if (error) {
  //       throw error;
  //     }
  //     // Get provided accounts and chainId
  //     const { accounts, chainId } = payload.params[0];
  //     console.log('WalletConnect - connected to Metamask', accounts, chainId);
  //     this.walletAddress = accounts[0];
  //     this.onWalletConnectCallback(this.walletConnector, this.walletAddress);
  //   });
  //   this.walletConnector.on('session_update', (error, payload) => {
  //     if (error) {
  //       throw error;
  //     }
  //     // Get updated accounts and chainId
  //     const { accounts, chainId } = payload.params[0];
  //     console.log('WalletConnect - session updated', accounts, chainId);
  //   });
  // }
  // public set setOnWalletConnectCallback(
  //   callback: typeof this.onWalletConnectCallback,
  // ) {
  //   this.onWalletConnectCallback = callback;
  // }
  // getNfts() {
  //   if (!this.walletAddress)
  //     throw new Error('Please connect wallet before accessing JsonRPC');
  //   return alchemy.nft
  //     .getNftsForOwner(this.walletAddress)
  //     .then((response) => console.log('Owned NFTS: ', response));
  // }
  // getWalletDeeplink() {
  //   return this.walletConnectService.getDeeplink();
  // }
  // getLoginURL() {
  //   return this.walletConnector.uri;
  // }
}
