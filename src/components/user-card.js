import { fetchUser as fetchNeynarUser } from "@/src/hooks/neynar";
import Image from "next/image";

const UserCard = async ({ fid }) => {
  const neynarUser = await fetchNeynarUser(fid);

  if (!neynarUser) {
    return <div></div>;
  }

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60px auto",
          alignItems: "center",
        }}
      >
        {neynarUser?.pfp?.url != null && (
          <Image
            style={{ borderRadius: "50%" }}
            src={neynarUser.pfp?.url}
            alt="pfp"
            width={50}
            height={50}
          />
        )}
        <div>
          <p style={{ fontWeight: "bold", margin: "0.2rem" }}>
            {neynarUser.displayName}{" "}
            <span style={{ fontWeight: "normal" }}>
              (@{neynarUser.username})
            </span>
          </p>
          <p style={{ margin: "0.2rem" }}>{neynarUser.profile.bio.text}</p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
