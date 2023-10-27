import Fid from "@/app/fid/[id]/page";
import FullPageError from "@/src/components/error";
import { fetchFidByAddress } from "@/src/hooks/hub";

export default async function WalletPage({ params }) {
  const { address } = params;

  const fid = await fetchFidByAddress(address);
  if (!fid)
    return (
      <FullPageError
        errorMessage={`No farcaster account for wallet ${address}`}
      />
    );

  return Fid({ params: { id: fid } });
}
