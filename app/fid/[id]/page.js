import { Suspense } from "react";
import NeynarUser from "@/src/components/neynar-user";
import UserCard from "@/src/components/user-card";
import WarpcastUser from "@/src/components/warpcast-user";
import HubUser from "@/src/components/hub-user";

export default async function Fid({ params }) {
  return (
    <div>
      <div
        style={{
          padding: "2rem",
          backgroundColor: "rgb(245, 243, 228)",
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <UserCard fid={params.id} />
        </Suspense>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          columnGap: "2rem",
          padding: "2rem",
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <NeynarUser fid={params.id} />
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <WarpcastUser fid={params.id} />
        </Suspense>
      </div>

      <div style={{ padding: "2rem" }}>
        <Suspense fallback={<div>Loading...</div>}>
          <HubUser fid={params.id} />
        </Suspense>
      </div>
    </div>
  );
}
