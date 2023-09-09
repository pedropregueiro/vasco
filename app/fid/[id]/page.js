import { fetchUser as fetchNeynarUser } from "@/src/hooks/neynar";
import { fetchUserData as fetchHubUserData } from "@/src/hooks/hub";
import { fetchUser as fetchWarpcastUser } from "@/src/hooks/warpcast";

export default async function Fid({ params }) {
  const neynarUser = await fetchNeynarUser(params.id);
  const hubUserData = await fetchHubUserData({
    fid: params.id,
  });
  const warpcastUser = await fetchWarpcastUser(params.id);

  return (
    <div>
      <h2>
        {neynarUser.displayName} (@{neynarUser.username})
      </h2>
      <p>{neynarUser.profile.bio.text}</p>
      <hr />
      <h2>Neynar</h2>
      <pre>{JSON.stringify(neynarUser, null, 2)}</pre>
      <hr />
      <h2>Warpcast</h2>
      <pre>{JSON.stringify(warpcastUser, null, 2)}</pre>
      <hr />
      <h2>Hub (GetUserDataByFid)</h2>
      <pre>{JSON.stringify(hubUserData, null, 2)}</pre>
    </div>
  );
}
