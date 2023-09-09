import { fetchUser as fetchNeynarUser } from "@/src/hooks/neynar";

const UserCard = async ({ fid }) => {
  const neynarUser = await fetchNeynarUser(fid);

  return (
    <>
      <h2>
        {neynarUser.displayName} (@{neynarUser.username})
      </h2>
      <p>{neynarUser.profile.bio.text}</p>
    </>
  );
};

export default UserCard;
