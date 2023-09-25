import {
  fetchAllUserCastMessages,
  fetchAllUserDataMessages,
  fetchAllUserReactionMessages,
  fetchSignerEvent,
} from "@/src/hooks/hub";
import { bytesToHex, parseAbiParameters, toBytes, toHex } from "viem";
import { decodeAbiParameters } from "viem";
import { bytesToHexString } from "@farcaster/hub-nodejs";
import { fetchUser } from "@/src/hooks/neynar";
import { truncateAddress } from "@/src/utils/ethereum";
import { decodeMetadata } from "@/src/utils/farcaster";

export const revalidate = 0;

const KEY_METADATA_TYPE = [
  {
    components: [
      {
        internalType: "uint256",
        name: "requestFid",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "requestSigner",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    internalType: "struct SignedKeyRequestValidator.SignedKeyRequestMetadata",
    name: "metadata",
    type: "tuple",
  },
];

export default async function Signer({ params }) {
  const { id: fid, publicKey } = params;

  const signerEvent = await fetchSignerEvent({
    fid: Number(fid),
    publicKey,
    toJson: false,
  });

  if (!signerEvent) throw "no signer event found";

  const metadata = signerEvent?.signerEventBody?.metadata;
  const parsedMetadata = decodeMetadata(metadata);

  const appFid = parsedMetadata[0].requestFid;
  const appFidInfo = await fetchUser(appFid);

  const allMessages = await fetchAllUserCastMessages({
    fid,
    signer: publicKey,
  });

  const allReactions = await fetchAllUserReactionMessages({
    fid,
    signer: publicKey,
  });

  return (
    <div>
      <div
        style={{
          padding: "2rem",
          backgroundColor: "rgb(245, 243, 228)",
        }}
      >
        <h2>{truncateAddress(publicKey)}</h2>
        <p style={{ fontWeight: "bold", margin: "0.2rem" }}>
          {appFidInfo.displayName}{" "}
          <span style={{ fontWeight: "normal" }}>(@{appFidInfo.username})</span>
        </p>
        <p style={{ margin: "0.2rem" }}>{appFidInfo.profile.bio.text}</p>
      </div>

      <div className="two-column-grid">
        <div style={{ padding: "2rem" }}>
          <h2>Casts</h2>
          <pre>{JSON.stringify(allMessages, null, 2)}</pre>
        </div>
        <div style={{ padding: "2rem" }}>
          <h2>Reactions</h2>
          <pre>{JSON.stringify(allReactions, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
