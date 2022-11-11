import { Injectable } from '@nestjs/common';
import { alchemy } from 'src/alchemy.adapter';
import * as path from 'path';
import * as fs from 'fs';
import * as csv from 'fast-csv';

@Injectable()
export class AuthorizationService {
  async checkNftOwnership(ownerWallet: string, contractAddresses: string[]) {
    try {
      console.log(
        `[AuthorizationService] checking nft ownership (ownerWallet: ${ownerWallet}, contractAddresses: ${contractAddresses})`,
      );

      return await alchemy.nft.checkNftOwnership(
        ownerWallet,
        contractAddresses,
      );
    } catch (error) {
      console.error(
        `[AuthorizationService] ERROR checking nft ownership: ${error} \n (ownerWallet: ${ownerWallet}, contractAddresses: ${contractAddresses})`,
      );
    }
  }

  private getParsedAuthNftList() {
    return new Promise<Map<string, Set<string>>>((resolve, reject) => {
      const authorizedNfts = new Map<string, Set<string>>();

      fs.createReadStream(path.resolve(__dirname, 'authorized_nft_list.csv'))
        .pipe(
          csv.parse({
            headers: ['contractAddress', 'tokenId', 'chainId', 'metadata'],
            renameHeaders: true,
          }),
        )
        .on('error', (error) => {
          console.error(
            'Error happened trying to parse CSV authorized_nft_list.csv',
            error,
          );
          reject(error);
        })
        .on('data', (data) => {
          const nft = authorizedNfts.get(data.contractAddress);
          authorizedNfts.set(
            data.contractAddress,
            nft ? nft.add(data.tokenId) : new Set(data.tokenId),
          );
        })
        .on('end', (data) => {
          resolve(authorizedNfts);
        });
      // console.log('stream', stream);
    });
  }

  async isStreamingAvailable(ownerWallet: string, query: any) {
    try {
      console.log(
        `[AuthorizationService] checking is streaming available (ownerWallet: ${ownerWallet}, query: ${query})`,
      );
      const response = await alchemy.nft.getNftsForOwner(ownerWallet, query);
      const ownedContracts = new Set<string>();
      const ownedNfts = new Map<string, Set<string>>();

      response.ownedNfts.forEach((token) => {
        const address = token.contract.address;
        ownedContracts.add(address);
        const idsByContract = ownedNfts.get(address);
        ownedNfts.set(
          address,
          idsByContract
            ? idsByContract.add(token.tokenId)
            : new Set(token.tokenId),
        );
      });

      const authorizedNftList = await this.getParsedAuthNftList();

      return {
        streamingAccessAllowed: Array.from(authorizedNftList.entries()).some(
          ([authorizedContractAddress, authorizedTokens]) =>
            ownedContracts.has(authorizedContractAddress) &&
            Array.from(authorizedTokens).some((authorizedTokenId) =>
              ownedNfts.get(authorizedContractAddress).has(authorizedTokenId),
            ),
        ),
      };
    } catch (error) {
      console.error(
        `[AuthorizationService] ERROR checking is streaming available: ${error} \n (ownerWallet: ${ownerWallet}, query: ${query})`,
      );
    }
  }
}
