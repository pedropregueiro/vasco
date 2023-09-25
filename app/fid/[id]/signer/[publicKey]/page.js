import {
  fetchAllUserCastMessages,
  fetchAllUserReactionMessages,
  fetchSignerEvent,
} from "@/src/hooks/hub";
import { fetchUser } from "@/src/hooks/neynar";
import { truncateAddress } from "@/src/utils/ethereum";
import { decodeMetadata } from "@/src/utils/farcaster";
import { MutedText } from "@/src/components/text";

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
  });
  const signerMessages = allMessages.filter((message) => {
    return message.signer == publicKey;
  });

  const allReactions = await fetchAllUserReactionMessages({
    fid,
  });
  const signerReactions = allReactions.filter((message) => {
    return message.signer == publicKey;
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
          <MutedText>
            <span style={{ fontWeight: "bold" }}>{signerMessages.length}</span>{" "}
            from the last 100 messages
          </MutedText>
          <pre>{JSON.stringify(signerMessages, null, 2)}</pre>
        </div>
        <div style={{ padding: "2rem" }}>
          <h2>Reactions</h2>
          <MutedText>
            <span style={{ fontWeight: "bold" }}>{signerReactions.length}</span>{" "}
            from the last 100 reactions (likes and recasts)
          </MutedText>
          <pre>{JSON.stringify(signerReactions, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
