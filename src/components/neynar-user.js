import { fetchCustodyAddress, fetchUser } from "@/src/hooks/neynar";

const NeynarUser = async ({ fid }) => {
  const user = await fetchUser(fid);
  const custodyAddress = await fetchCustodyAddress(fid);

  return (
    <div>
      <h2>Neynar (v1)</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(custodyAddress, null, 2)}</pre>
    </div>
  );
};

export default NeynarUser;
