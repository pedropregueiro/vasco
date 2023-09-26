import React from "react";
import Link from "next/link";
import { truncateAddress } from "../utils/ethereum";
import { decodeMetadata } from "../utils/farcaster";
import { fetchUser } from "../hooks/neynar";
import {
  fetchAllUserCastMessages,
  fetchAllUserReactionMessages,
} from "../hooks/hub";
import { MutedText } from "./text";
import FormattedDate from "./formatted-date";

const percentageFormatter = new Intl.NumberFormat("en", {
  style: "percent",
  maximumSignificantDigits: 2,
});

const Signer = async ({ fid, signer, castsCount, reactionsCount }) => {
  const signerCreatedApprox = signer?.blockTimestamp * 1000;
  const publicKey = signer?.signerEventBody?.key;
  const metadata = signer?.signerEventBody?.metadata;
  const parsedMetadata = decodeMetadata(metadata);
  const appFid = parsedMetadata[0].requestFid;
  const appFidInfo = await fetchUser(appFid);

  const signerMessages = await fetchAllUserCastMessages({
    fid,
    signer: publicKey,
  });

  const signerReactions = await fetchAllUserReactionMessages({
    fid,
    signer: publicKey,
  });

  const isSignerActive = signerMessages.length + signerReactions.length > 0;
  const castPercentage = signerMessages.length / castsCount;
  const reactionPercentage = signerReactions.length / reactionsCount;

  return (
    <Link href={`/fid/${fid}/signer/${publicKey}`}>
      <div
        style={{
          marginTop: "2rem",
          minHeight: "10rem",
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            columnGap: "0.5rem",
          }}
        >
          <h3>{truncateAddress(publicKey)}</h3>
          {isSignerActive ? (
            <div style={{ textAlign: "right" }}>
              <MutedText title="Of the last 100 casts">
                Casts{" "}
                {isNaN(castPercentage)
                  ? "—"
                  : percentageFormatter.format(castPercentage)}
              </MutedText>
              <MutedText title="Of the last 100 reactions">
                Reactions{" "}
                {isNaN(reactionPercentage)
                  ? "—"
                  : percentageFormatter.format(reactionPercentage)}
              </MutedText>
            </div>
          ) : (
            <MutedText title="Of the last 100 casts and reactions">
              No recent activity
            </MutedText>
          )}
        </div>

        <p style={{ fontWeight: "bold", margin: "0.2rem 0" }}>
          {appFidInfo.displayName}{" "}
          <span style={{ fontWeight: "normal" }}>(@{appFidInfo.username})</span>
        </p>
        <p style={{ margin: "0.2rem 0" }}>{appFidInfo.profile.bio.text}</p>
        <MutedText style={{ marginTop: "1rem" }}>
          Added on <FormattedDate value={signerCreatedApprox} />
        </MutedText>
      </div>
    </Link>
  );
};

export default Signer;
