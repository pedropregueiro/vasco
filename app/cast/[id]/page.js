import { fetchCast as fetchNeynarCast } from "@/src/hooks/neynar";
import { fetchCast as fetchHubCast } from "@/src/hooks/hub";
import { fetchCast as fetchWarpcastCast } from "@/src/hooks/warpcast";

const CastAuthor = ({ cast }) => {
  const author = cast.author;
  const warpcastAuthorLink = `https://warpcast.com/${author.username}`;

  return (
    <>
      <p>{author.display_name || author.displayName}</p>
      <a
        href={warpcastAuthorLink}
        target="_blank"
        rel="noreferrer"
        style={{ textDecoration: "none" }}
      >
        (@{author.username})
      </a>
    </>
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

  return (
    <div>
      <h2>{neynarCast.hash}</h2>
      <CastAuthor cast={neynarCast} />
      <CastBody cast={neynarCast} />
      <hr />
      <a
        href={`https://warpcast.com/${
          neynarCast.author.username
        }/${params.id.slice(0, 8)}`}
        target="_blank"
        rel="noreferrer"
      >
        Warpcast
      </a>
      <a
        href={`https://phrasetown.com/app/cast/${params.id}`}
        target="_blank"
        rel="noreferrer"
      >
        Phrasetown
      </a>
      <hr />
      <h2>Neynar</h2>
      <pre>{JSON.stringify(neynarCast, null, 2)}</pre>
      <hr />
      <h2>Warpcast</h2>
      <pre>{JSON.stringify(warpcastCast, null, 2)}</pre>
      <hr />
      <h2>Hub (GetCast)</h2>
      <pre>{JSON.stringify(hubCast, null, 2)}</pre>
    </div>
  );
}
