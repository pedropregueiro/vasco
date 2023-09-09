import { fetchUser } from "@/src/hooks/neynar";

const NeynarUser = async ({ fid }) => {
  const user = await fetchUser(fid);

  return (
    <>
      <h2>Neynar</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
};

export default NeynarUser;
