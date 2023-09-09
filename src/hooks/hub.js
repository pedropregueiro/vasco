import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";
import { hexToBytes } from "viem";

const farcasterClient = getSSLHubRpcClient(
  process.env.FARCASTER_HUB_RPC_ENDPOINT,
  {
    metadata: false,
  }
);

export const fetchCast = async ({ hash, fid }) => {
  return farcasterClient
    .getCast({ hash: hexToBytes(hash), fid })
    .then((result) => {
      if (result.isErr()) {
        throw result.error;
      }

      return Message.toJSON(result.value);
    });
};

export const fetchUserData = async (fid) => {
  return farcasterClient.getUserDataByFid({ fid }).then((result) => {
    if (result.isErr()) {
      throw result.error;
    }

    const messages = result.value.messages;
    const jsonMessages = messages.map((message) => {
      return Message.toJSON(message);
    });

    return jsonMessages;
  });
};
