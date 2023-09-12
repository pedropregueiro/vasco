import { fetchUserData, fetchUserSigners } from "@/src/hooks/hub";

const HubUser = async ({ fid }) => {
  const userData = await fetchUserData(fid);
  const userSigners = await fetchUserSigners(fid);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        columnGap: "2rem",
      }}
    >
      <div>
        <h2>GetUserDataByFid</h2>
        <pre>{JSON.stringify(userData, null, 2)}</pre>
      </div>
      <div>
        <h2>GetOnChainSignersByFid</h2>
        <pre>{JSON.stringify(userSigners, null, 2)}</pre>
      </div>
    </div>
  );
};

export default HubUser;
