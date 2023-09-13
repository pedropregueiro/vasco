import { fetchUserThreadCasts } from "@/src/hooks/warpcast";
import { redirect } from "next/navigation";

export default async function Warpcast({ params }) {
  const { hashPrefix, username } = params;

  // fetch first cast to get full cast hash
  const casts = await fetchUserThreadCasts({ hashPrefix, username, limit: 1 });
  if (!casts || casts.length == 0) throw "no casts found";

  redirect(`/cast/${casts[0].hash}`);
}
