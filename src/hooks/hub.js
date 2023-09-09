import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";
import { hexToBytes } from "viem";

export const fetchCast = async ({ hash, fid }) => {
  const farcasterClient = getSSLHubRpcClient(
    process.env.FARCASTER_HUB_RPC_ENDPOINT,
    {
      metadata: false,
    }
  );

  return farcasterClient
    .getCast({ hash: hexToBytes(hash), fid })
    .then((result) => {
      if (result.isErr()) {
        throw result.error;
      }

      return Message.toJSON(result.value);
    });
};
