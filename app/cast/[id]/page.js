import { Suspense } from "react";
import {
  fetchCast as fetchNeynarCast,
  fetchUser,
  fetchV2Casts,
} from "@/src/hooks/neynar";
import { fetchCast as fetchHubCast, fetchSignerEvents } from "@/src/hooks/hub";
import { fetchCast as fetchWarpcastCast } from "@/src/hooks/warpcast";
import Image from "next/image";
import Link from "next/link";
import { decodeMetadata } from "@/src/utils/farcaster";
import { truncateAddress } from "@/src/utils/ethereum";
import UserCard from "@/src/components/user-card";
import { MutedText } from "@/src/components/text";

export const revalidate = 0;

const KNOWN_HUBS = [
  { hub: "Farcaster (Nemes)", endpoint: "https://nemes.farcaster.xyz:2281" },
  { hub: "Neynar", endpoint: "https://api.neynar.com:2281" },
  { hub: "Pinata", endpoint: "https://hub.pinata.cloud" },
  { hub: "Farcaster (Lamia)", endpoint: "https://lamia.farcaster.xyz:2281" },
  // { hub: "NodeRPC", endpoint: "https://www.noderpc.xyz/farcaster-mainnet-hub" },
];

const CastAuthor = ({ cast }) => {
  const author = cast.author;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "45px auto",
        alignItems: "center",
      }}
    >
      <Image
        style={{ borderRadius: "50%" }}
        src={author.pfp.url}
        alt="pfp"
        width={40}
        height={40}
      />
      <div>
        <Link href={`/fid/${author.fid}`}>
          <p style={{ fontWeight: "bold", margin: "0.2rem" }}>
            {author.displayName}{" "}
            <span style={{ fontWeight: "normal" }}>(@{author.username})</span>
          </p>
        </Link>
      </div>
    </div>
  );
};

const CastBody = ({ cast }) => {
  if (cast == null) return null;
  return (
    <p style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
      {cast.text}
    </p>
  );
};

export default async function Cast({ params }) {
  let neynarCast;
  let hubCast;
  let warpcastCast;
  let neynarV2Cast;

  try {
    neynarCast = await fetchNeynarCast(params.id);
  } catch (e) {
    neynarCast = e.message;
  }

  try {
    warpcastCast = await fetchWarpcastCast(params.id);
  } catch (e) {
    warpcastCast = e.message;
  }

  try {
    let neynarV2Casts = await fetchV2Casts([params.id]);
    neynarV2Cast = neynarV2Casts[0];
  } catch (e) {
    neynarV2Cast = e.message;
  }

  let appFidInfo;
  const fid = neynarCast?.author?.fid;
  let publicKey;
  let appFid;

  try {
    publicKey = hubCast?.signer;
    const signerEvent = await fetchSignerEvents({
      fid: Number(fid),
      publicKey,
    });

    if (!signerEvent) console.warn("no signer event found for", publicKey);

    const metadata = signerEvent?.signerEventBody?.metadata;
    const parsedMetadata = decodeMetadata(metadata);

    appFid = parsedMetadata[0].requestFid;
    appFidInfo = await fetchUser(appFid);
  } catch (e) {
    console.error("problem fetching app info", e);
  }

  let hubsResponses;

  try {
    hubsResponses = await Promise.all(
      KNOWN_HUBS.map(async (hub) => {
        try {
          const hubResponse = await fetchHubCast({
            hash: params.id,
            fid: neynarCast?.author?.fid,
            endpoint: hub.endpoint,
          });

          return {
            title: hub.hub,
            endpoint: hub.endpoint,
            response: hubResponse,
          };
        } catch (e) {
          return {
            title: hub.hub,
            endpoint: hub.endpoint,
            response: e,
            errorMessage: e.message,
            ...e,
          };
        }
      })
    );
  } catch (e) {
    console.error("problem fetching hub response", e);
  }

  return (
    <div>
      <div
        style={{
          padding: "2rem",
          backgroundColor: "rgb(245, 243, 228)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <div>
          {!neynarCast?.author ? (
            <p>Cast not found</p>
          ) : (
            <>
              <CastAuthor cast={neynarCast} />
              <CastBody cast={neynarCast} />
            </>
          )}
        </div>
        {appFidInfo && (
          <div>
            <MutedText>Cast signed by:</MutedText>
            <Link href={`/fid/${fid}/signer/${publicKey}`}>
              <UserCard fid={appFid} />
            </Link>
          </div>
        )}
      </div>
      <div className="two-column-grid">
        <div>
          <h2>Warpcast</h2>
          <pre>{JSON.stringify(warpcastCast, null, 2)}</pre>
        </div>
        <div>
          <h2>Neynar (v2)</h2>
          <pre>{JSON.stringify(neynarV2Cast, null, 2)}</pre>
        </div>
        <div>
          <h2>Neynar (v1)</h2>
          <pre>{JSON.stringify(neynarCast, null, 2)}</pre>
        </div>
      </div>

      <div className="two-column-grid">
        {hubsResponses.map((hubResponse) => (
          <Suspense
            key={hubResponse?.endpoint}
            fallback={<div>Loading...</div>}
          >
            <div>
              <h2 style={{ marginBottom: "0rem" }}>{hubResponse.title}</h2>
              <MutedText>{hubResponse.endpoint}</MutedText>
              <pre>
                {JSON.stringify(
                  hubResponse.errorMessage
                    ? hubResponse.response?.message
                    : hubResponse.response,
                  null,
                  2
                )}
              </pre>
            </div>
          </Suspense>
        ))}
      </div>
    </div>
  );
}
