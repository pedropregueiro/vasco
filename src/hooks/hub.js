import { getSSLHubRpcClient } from "@farcaster/hub-nodejs";
import { hexToBytes } from "viem";
import { parseHubObject, parseHubObjects } from "../utils/hub";

const farcasterClient = getSSLHubRpcClient(
  process.env.FARCASTER_HUB_RPC_ENDPOINT,
  {
    metadata: false,
  }
);

export const getClient = (endpoint) => {
  // if hubEndpoint is set, create new client, otherwise use default
  if (endpoint) return getSSLHubRpcClient(endpoint, { metadata: false });
  return farcasterClient;
};

export const fetchCast = async ({ hash, fid }) => {
  return farcasterClient
    .getCast({ hash: hexToBytes(hash), fid })
    .then((result) => {
      if (result.isErr()) {
        throw result.error;
      }

      return parseHubObject(result.value);
    })
    .catch((err) => {
      console.error(err);
    });
};

export const fetchUserData = async (fid) => {
  return farcasterClient.getUserDataByFid({ fid }).then((result) => {
    if (result.isErr()) {
      throw result.error;
    }

    const messages = result.value.messages;
    return parseHubObjects(messages);
  });
};

export const fetchUserSigners = async ({ fid }) => {
  return farcasterClient
    .getOnChainSignersByFid({ fid: Number(fid) })
    .then((result) => {
      if (result.isErr()) {
        throw result.error;
      }

      return result.value.events;
    })
    .then(async (messages) => {
      return parseHubObjects(messages);
    });
};

export const fetchHubInfo = async ({ hubEndpoint = "" }) => {
  const client = getClient(hubEndpoint);
  return client
    .getInfo({ dbStats: true })
    .then((result) => {
      if (result.isErr()) {
        throw result.error;
      }

      return parseHubObject(result.value);
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const fetchHubSyncStatus = async (peerId = "") => {
  return farcasterClient
    .getSyncStatus(peerId)
    .then((result) => {
      if (result.isErr()) {
        throw result.error;
      }

      return parseHubObject(result.value);
    })
    .catch((err) => {
      console.error(err);
    });
};

export const fetchHubSyncIdsByPrefix = async (prefix) => {
  return farcasterClient
    .getAllSyncIdsByPrefix({ prefix })
    .then((result) => {
      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    })
    .catch((err) => {
      console.error(err);
    });
};

export const fetchSignerEvent = async ({ fid, publicKey }) => {
  return farcasterClient
    .getOnChainSigner({ fid, signer: hexToBytes(publicKey) })
    .then((result) => {
      if (result.isErr()) {
        throw result.error;
      }

      return parseHubObject(result.value);
    })
    .catch((err) => {
      console.error(err);
    });
};

export const fetchAllUserCastMessages = async ({ fid, signer }) => {
  return await farcasterClient
    .getCastsByFid({
      fid: Number(fid),
      reverse: true,
      pageSize: 100,
    })
    .then((result) => {
      if (result.isErr()) {
        throw result.error;
      }

      return result.value.messages;
    })
    .then(async (messages) => {
      return parseHubObjects(messages);
    })
    .then((parsedMessages) => {
      if (signer) {
        return parsedMessages.filter((message) => {
          return message.signer == signer;
        });
      }

      return parsedMessages;
    })
    .catch((err) => {
      console.error(err);
    });
};

export const fetchAllUserReactionMessages = async ({ fid, signer }) => {
  return await farcasterClient
    .getReactionsByFid({
      fid: Number(fid),
      reverse: true,
      pageSize: 100,
    })
    .then((result) => {
      if (result.isErr()) {
        throw result.error;
      }

      return result.value.messages;
    })
    .then(async (messages) => {
      return parseHubObjects(messages);
    })
    .then((parsedMessages) => {
      if (signer) {
        return parsedMessages.filter((message) => {
          return message.signer == signer;
        });
      }

      return parsedMessages;
    })
    .catch((err) => {
      console.error(err);
    });
};
