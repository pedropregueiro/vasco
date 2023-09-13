import { fetchCast as fetchNeynarCast, fetchV2Casts } from "@/src/hooks/neynar";
import { fetchCast as fetchHubCast } from "@/src/hooks/hub";
import { fetchCast as fetchWarpcastCast } from "@/src/hooks/warpcast";
import Image from "next/image";
import Link from "next/link";

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
  const neynarCast = await fetchNeynarCast(params.id);
  const hubCast = await fetchHubCast({
    hash: params.id,
    fid: neynarCast.author.fid,
  });
  const warpcastCast = await fetchWarpcastCast(params.id);
  const neynarV2Casts = await fetchV2Casts([params.id]);

  return (
    <div>
      <div
        style={{
          padding: "2rem",
          backgroundColor: "rgb(245, 243, 228)",
        }}
      >
        <CastAuthor cast={neynarCast} />
        <CastBody cast={neynarCast} />
      </div>

      <div className="two-column-grid">
        <div>
          <h2>Warpcast</h2>
          <pre>{JSON.stringify(warpcastCast, null, 2)}</pre>
        </div>
        <div>
          <h2>Neynar (v2)</h2>
          <pre>{JSON.stringify(neynarV2Casts[0], null, 2)}</pre>
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
