import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { findMetadataPda, mplTokenMetadata, verifyCollectionV1 } from '@metaplex-foundation/mpl-token-metadata'
import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from '@solana-developers/helpers'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi';

const connection = new Connection(clusterApiUrl('devnet'));

const user = await getKeypairFromFile();

await airdropIfRequired(connection, user.publicKey, 5 * LAMPORTS_PER_SOL, 1 * LAMPORTS_PER_SOL);

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));

const collectionAddress = publicKey("6d1XemCWnS7skbc1CSr6LJaDD42Y3TLkRQNWMAEAdLqF");

const nftAddress = publicKey('EVwoUt4kkae9RF1UtbkWaZQW2CRLwtbkMdvs4tWgEWAw');

const transaction = await verifyCollectionV1(umi, {
    metadata: findMetadataPda(umi, { mint: nftAddress}),
    collectionMint: collectionAddress,
    authority: umi.identity
})

transaction.sendAndConfirm(umi);

console.log(`NFT ${nftAddress} of COLLECTION ${collectionAddress} is VERIFIED! Check at Explorer: ${getExplorerLink('address', nftAddress, 'devnet')}`);