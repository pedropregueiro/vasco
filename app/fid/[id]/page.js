import { Suspense } from "react";
import NeynarUser from "@/src/components/neynar-user";
import UserCard from "@/src/components/user-card";
import WarpcastUser from "@/src/components/warpcast-user";
import HubUser from "@/src/components/hub-user";

export default async function Fid({ params }) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <UserCard fid={params.id} />
      </Suspense>
      <hr />
      <Suspense fallback={<div>Loading...</div>}>
        <NeynarUser fid={params.id} />
      </Suspense>
      <hr />
      <Suspense fallback={<div>Loading...</div>}>
        <WarpcastUser fid={params.id} />
      </Suspense>
      <hr />
      <Suspense fallback={<div>Loading...</div>}>
        <HubUser fid={params.id} />
      </Suspense>
    </div>
  );
}
