import { publicKey } from './node_modules/@solana/buffer-layout-utils/src/web3';
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createNft, fetchDigitalAsset, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from '@solana-developers/helpers'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, keypairIdentity, percentAmount } from '@metaplex-foundation/umi';

const connection = new Connection(clusterApiUrl('devnet'));

const user = await getKeypairFromFile();

await airdropIfRequired(connection, user.publicKey, 5 * LAMPORTS_PER_SOL, 1 * LAMPORTS_PER_SOL);

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));

const collectionMint = generateSigner(umi);

const transaction = await createNft(umi, {
    mint: collectionMint,
    name: "Vagarth's Collection",
    symbol: "VAH",
    uri: "https://raw.githubusercontent.com/solana-developers/professional-education/main/labs/sample-nft-collection-offchain-data.json",
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true
});

await transaction.sendAndConfirm(umi);

const collectionNFT = await fetchDigitalAsset(umi, collectionMint.publicKey);

console.log(`Collection Created at Address ${getExplorerLink('address', collectionNFT.mint.publicKey, 'devnet')}`)