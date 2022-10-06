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

    this.handleEvents(initedConnection);

    return initedConnection;
  }

  async restoreConnection(sessionURI: string) {
    const userSession = await this.userSessionService.getSession(sessionURI);

    if (userSession === null || undefined)
      throw new Error(
        "\nUserSessionService can't find session with URI: " +
          sessionURI +
          '\n',
      );

    const prevSession = await JSON.parse(userSession.sessionJSON);
    const prevWcConnection = this.sessions.get(prevSession.uri);

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

    this.handleEvents(wcConnection);

    return wcConnection;
  }

  private handleEvents = async (wcConnection: WalletConnect) => {
    const wcSessionJSON = await JSON.stringify(wcConnection.session);
    const socketConnection = this.websocketGateway.server.to(wcConnection.uri);

    wcConnection.on('connect', async (error, payload) => {
      if (error) throw new Error('WalletConnect failed to connect');
      const { accounts } = payload.params[0];
      const walletAddress = accounts[0];

      try {
        await this.userSessionService.createSession({
          sessionId: wcConnection.uri,
          sessionJSON: wcSessionJSON,
          wallet: walletAddress,
        });

        this.sessions.set(walletAddress, wcConnection);

        socketConnection.emit('wc-connected', {
          ...payload.params[0],
          wcSessionJSON,
        });
        console.log('Socket.io emit [wc-connected] to: ' + wcConnection.uri);

        console.log('WalletConnect, wallet connected successfully');
      } catch (error) {
        console.log('WalletConnect, failed to save user session in db', error);
      } finally {
      }
    });

    wcConnection.on('session_update', (error, payload) => {
      if (error) {
        throw error;
      }
      const { accounts, chainId } = payload.params[0];

      socketConnection.emit('wc-session-update', {
        ...payload.params[0],
        wcSessionJSON,
      });
      console.log('Socket.io emit [wc-session-update] to: ' + wcConnection.uri);

      console.log('WalletConnect - session updated', accounts, chainId);
    });

    wcConnection.on('disconnect', (error, payload) => {
      if (error) throw error;

      if (this.sessions.delete(wcConnection.uri)) {
        console.log('WalletConnect session disconnect: ', wcConnection.uri);
      } else {
        console.log(
          `WalletConnect session - ${wcConnection.uri} doesn't exsits in app`,
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
