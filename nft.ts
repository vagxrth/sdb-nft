import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createNft, fetchDigitalAsset, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from '@solana-developers/helpers'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, keypairIdentity, percentAmount, publicKey } from '@metaplex-foundation/umi';

const connection = new Connection(clusterApiUrl('devnet'));

const user = await getKeypairFromFile();

await airdropIfRequired(connection, user.publicKey, 5 * LAMPORTS_PER_SOL, 1 * LAMPORTS_PER_SOL);

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));

const collectionAddress = publicKey("6d1XemCWnS7skbc1CSr6LJaDD42Y3TLkRQNWMAEAdLqF");

const mint = generateSigner(umi);

const transaction = await createNft(umi, {
    mint: mint,
    name: "Third World Tyrant",
    uri: "https://raw.githubusercontent.com/solana-developers/professional-education/main/labs/sample-nft-offchain-data.json",
    sellerFeeBasisPoints: percentAmount(0),
    collection: {
        key: collectionAddress,
        verified: false
    }
})

await transaction.sendAndConfirm(umi);

const nft = await fetchDigitalAsset(umi, mint.publicKey);

console.log(`NFT Created at Address ${getExplorerLink('address', nft.mint.publicKey, 'devnet')}`)