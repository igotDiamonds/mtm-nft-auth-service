import { Injectable } from '@nestjs/common';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';

import { UserSessionService } from 'src/user-session/user-session.service';
import { WebSocketGateway } from 'src/websocket.gateway';

@Injectable()
export class WalletConnectService {
  constructor(
    private userSessionService: UserSessionService,
    private websocketGateway: WebSocketGateway,
  ) {}

  private sessions: Map<string, WalletConnect> = new Map();

  async createConnection() {
    const wcConnection = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org', // Required
      qrcodeModal: QRCodeModal,
      clientMeta: {
        description: 'Server side auth',
        url: 'https://mtmart.io',
        name: 'MTM Auth',
        icons: [],
      },
    });

    const initedConnection = await this.initWCConnection(wcConnection);
    this.sessions.set(initedConnection.handshakeTopic, initedConnection);

    this.handleEvents(initedConnection);

    return initedConnection;
  }

  async restoreConnection(token: string) {
    const userSession = await this.userSessionService.getSession(token);

    if (userSession === null || undefined)
      throw new Error(
        "UserSessionService can't find session with token " + token,
      );

    const prevWcConnection = this.sessions.get(userSession.sessionId);

    if (prevWcConnection) {
      prevWcConnection.off('connect');
      prevWcConnection.off('session_update');
      prevWcConnection.off('disconnect');
      console.log('Off Events for previous WC');
    }

    const wcConnection = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org', // Required
      qrcodeModal: QRCodeModal,
      session: await JSON.parse(userSession.sessionJSON),
      clientMeta: {
        description: 'Server side auth',
        url: 'https://mtmart.io',
        name: 'MTM Auth',
        icons: [],
      },
    });

    // const initedConnection = await this.initWCConnection(wcConnection);
    console.log('isConnectedOnRestore?:', wcConnection.connected);
    wcConnection.createSession();
    this.handleEvents(wcConnection);
    this.sessions.set(userSession.sessionId, wcConnection);

    return wcConnection;
  }

  private handleEvents = async (wcConnection: WalletConnect) => {
    const wcSessionJSON = await JSON.stringify(wcConnection.session);

    wcConnection.on('connect', async (error, payload) => {
      if (error) throw new Error('WalletConnect failed to connect');
      const { accounts } = payload.params[0];
      const wallet = accounts[0];

      try {
        console.log('Topic - ', wcConnection.handshakeTopic);

        await this.userSessionService.createSession({
          sessionId: wcConnection.handshakeTopic,
          sessionJSON: wcSessionJSON,
          wallet,
        });

        this.websocketGateway.server
          .to(wcConnection.handshakeTopic)
          .emit('wc-connected', {
            ...payload.params[0],
            wcSessionJSON,
          });

        console.log('WalletConnect, wallet connected successfully');
      } catch (error) {
        console.log('WalletConnect Connect Event Error: ', error);
      } finally {
      }
    });

    wcConnection.on('session_update', (error, payload) => {
      if (error) {
        throw error;
      }

      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0];
      this.websocketGateway.server
        .to(wcConnection.handshakeTopic)
        .emit('wc-session-update', {
          ...payload.params[0],
          wcSessionJSON,
        }),
        console.log('WalletConnect - session updated', accounts, chainId);
    });

    wcConnection.on('disconnect', (error, payload) => {
      if (error) throw error;

      if (this.sessions.delete(wcConnection.handshakeTopic)) {
        console.log(
          'WalletConnect session disconnect: ',
          wcConnection.handshakeTopic,
        );
      } else {
        console.log(
          `WalletConnect session - ${wcConnection.handshakeTopic} doesn't exsits in app`,
        );
      }
    });
  };

  private initWCConnection = async (wcConnection: WalletConnect) => {
    if (!wcConnection.connected)
      await wcConnection
        .createSession()
        .catch((e) => console.log('WalletConnet createSession error: \n', e));

    return wcConnection;
  };
}
