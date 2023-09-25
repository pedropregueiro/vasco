import {
  fetchAllUserCastMessages,
  fetchAllUserReactionMessages,
  fetchUserSigners,
} from "@/src/hooks/hub";

import Signer from "@/src/components/signer";
import { Suspense } from "react";
import UserCard from "@/src/components/user-card";

export const revalidate = 0;

export default async function Signers({ params }) {
  const { id: fid } = params;

  const signers = await fetchUserSigners({ fid });
  const casts = await fetchAllUserCastMessages({ fid });
  const reactions = await fetchAllUserReactionMessages({ fid });

  return (
    <div>
      <div
        style={{
          padding: "2rem",
          backgroundColor: "rgb(245, 243, 228)",
        }}
      >
        <h2>Signers</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <UserCard fid={fid} />
        </Suspense>
      </div>

      <div className="three-column-grid">
        {signers.map((signer) => (
          <Suspense
            key={signer?.signerEventBody?.key}
            fallback={
              <div
                style={{
                  marginTop: "2rem",
                  minHeight: "10rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "1rem",
                }}
              >
                Loading...
              </div>
            }
          >
            <Signer
              fid={fid}
              signer={signer}
              castsCount={casts.length}
              reactionsCount={reactions.length}
            />
          </Suspense>
        ))}
      </div>

      <div style={{ padding: "2rem" }}>
        <h2>All signers</h2>
        <pre>{JSON.stringify(signers, null, 2)}</pre>
      </div>
    </div>
  );
}
