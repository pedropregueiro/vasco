import {
  getSSLHubRpcClient,
  Message,
  OnChainEvent,
} from "@farcaster/hub-nodejs";
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
    const jsonMessages = messages.map((message) => {
      return Message.toJSON(message);
    });

    return jsonMessages;
  });
};

export const fetchUserSigners = async (fid) => {
  return farcasterClient.getOnChainSignersByFid({ fid }).then((result) => {
    if (result.isErr()) {
      throw result.error;
    }

    const events = result.value.events;
    const jsonEvents = events.map((event) => {
      return OnChainEvent.toJSON(event);
    });

    return jsonEvents;
  });
};

export const fetchHubInfo = async () => {
  return farcasterClient
    .getInfo({ dbStats: true })
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

export const fetchHubSyncStatus = async (peerId = "") => {
  return farcasterClient
    .getSyncStatus(peerId)
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
