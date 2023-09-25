import {
  fetchAllUserCastMessages,
  fetchAllUserReactionMessages,
  fetchUserSigners,
} from "@/src/hooks/hub";

import Signer from "@/src/components/signer";

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
      </div>

      <div className="three-column-grid">
        {signers.map((signer) => (
          <Signer
            key={signer?.signerEventBody?.key}
            fid={fid}
            signer={signer}
            castsCount={casts.length}
            reactionsCount={reactions.length}
          />
        ))}
      </div>

      <div style={{ padding: "2rem" }}>
        <h2>All signers</h2>
        <pre>{JSON.stringify(signers, null, 2)}</pre>
      </div>
    </div>
  );
}
