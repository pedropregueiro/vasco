import { fetchUser } from "@/src/hooks/warpcast";

const WarpcastUser = async ({ fid }) => {
  const user = await fetchUser(fid);

  return (
    <>
      <h2>Warpcast</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
};

export default WarpcastUser;
