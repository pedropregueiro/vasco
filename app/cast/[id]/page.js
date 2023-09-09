import { fetchCast as fetchNeynarCast } from "@/src/hooks/neynar";
import { fetchCast as fetchHubCast } from "@/src/hooks/hub";
import { hexToBytes } from "viem";

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

export default async function Page({ params }) {
  const neynarCast = await fetchNeynarCast(params.id);
  const hubCast = await fetchHubCast({
    hash: params.id,
    fid: neynarCast.author.fid,
  });

  return (
    <div>
      <h2>{neynarCast.hash}</h2>
      <CastAuthor cast={neynarCast} />
      <CastBody cast={neynarCast} />
      <hr />
      <pre>{JSON.stringify(neynarCast, null, 2)}</pre>
      <hr />
      <pre>{JSON.stringify(hubCast, null, 2)}</pre>
    </div>
  );
}
