import { fetchUserByUsername } from "@/src/hooks/neynar";
import { redirect } from "next/navigation";

export default async function Warpcast({ params }) {
  const { username } = params;

  const user = await fetchUserByUsername(username);
  if (!user) throw "no user found";

  redirect(`/fid/${user.fid}`);
}
