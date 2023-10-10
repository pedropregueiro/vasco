import { fetchCast as fetchNeynarCast, fetchV2Casts } from "@/src/hooks/neynar";
import { fetchCast as fetchHubCast } from "@/src/hooks/hub";
import { fetchCast as fetchWarpcastCast } from "@/src/hooks/warpcast";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 120;

const CastAuthor = ({ cast }) => {
  const author = cast.author;
  const warpcastAuthorLink = `https://warpcast.com/${author.username}`;

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
    hubCast = await fetchHubCast({
      hash: params.id,
      fid: neynarCast.author.fid,
    });
  } catch (e) {
    hubCast = e.message;
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

  return (
    <div>
      <div
        style={{
          padding: "2rem",
          backgroundColor: "rgb(245, 243, 228)",
        }}
      >
        {!neynarCast?.author ? (
          <p>Cast not found</p>
        ) : (
          <>
            <CastAuthor cast={neynarCast} />
            <CastBody cast={neynarCast} />
          </>
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

      <div style={{ padding: "2rem" }}>
        <h2>Hub (GetCast)</h2>
        <pre>{JSON.stringify(hubCast, null, 2)}</pre>
      </div>
    </div>
  );
}
