import { fetchUser } from "@/src/hooks/warpcast";

const WarpcastUser = async ({ fid }) => {
  const user = await fetchUser(fid);

  return (
    <div>
      <h2>Warpcast</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default WarpcastUser;
