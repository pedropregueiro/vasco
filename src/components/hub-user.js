import { fetchUserData } from "@/src/hooks/hub";

const HubUser = async ({ fid }) => {
  const userData = await fetchUserData(fid);

  return (
    <>
      <h2>Hub (GetUserDataByFid)</h2>
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </>
  );
};

export default HubUser;
