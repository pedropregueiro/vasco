import { fetchUserThreadCasts } from "@/src/hooks/warpcast";
import { redirect } from "next/navigation";

export default async function Warpcast({ params }) {
  const { hashPrefix, username } = params;

  // fetch first cast to get full cast hash
  const casts = await fetchUserThreadCasts({ hashPrefix, username, limit: 2 });

  // Warpcast has some odd root cast in threads within a channel
  const probableCasts = casts.filter((cast) =>
    cast.hash.startsWith(hashPrefix)
  );

  if (!probableCasts || probableCasts.length == 0) throw "no casts found";

  redirect(`/cast/${probableCasts[0].hash}`);
}
