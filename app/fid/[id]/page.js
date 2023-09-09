import { fetchUser as fetchNeynarUser } from "@/src/hooks/neynar";
import { fetchUserData as fetchHubUserData } from "@/src/hooks/hub";

export default async function Fid({ params }) {
  const neynarUser = await fetchNeynarUser(params.id);
  const hubUserData = await fetchHubUserData({
    fid: params.id,
  });

  return (
    <div>
      <h2>{params.id}</h2>
      <hr />
      <pre>{JSON.stringify(neynarUser, null, 2)}</pre>
      <hr />
      <pre>{JSON.stringify(hubUserData, null, 2)}</pre>
    </div>
  );
}
