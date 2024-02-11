import { hexToBytes } from "viem";
// import { parseHubObject, parseHubObjects } from "../utils/hub";

const hubFetch = async (url, options) => {
  const headers = {
    api_key: process.env.NEYNAR_API_KEY,
  };
  const response = await fetch(
    `${process.env.FARCASTER_HUB_HTTP_ENDPOINT}${url}`,
    {
      ...options,
      headers,
    }
  );
  const data = await response.json();

  if (!response.ok) {
    console.error(data);
    return Promise.reject(
      new Error(`${response.status} ${response.statusText}`)
    );
  }

  return data;
};

export const fetchSignerEvents = async ({ fid, publicKey }) => {
  const params = new URLSearchParams({
    fid: Number(fid),
  });

  if (publicKey) {
    params.set("signer", publicKey);
  }
  return hubFetch("/onChainSignersByFid?" + params);
};

export const fetchCast = async ({ fid, hash }) => {
  const params = new URLSearchParams({
    fid: Number(fid),
    hash: hash,
  });

  return hubFetch("/castById?" + params);
};

export const fetchUserData = async (fid) => {
  const params = new URLSearchParams({
    fid: Number(fid),
  });

  return hubFetch("/userDataByFid?" + params);
};

export const fetchUserSigners = async ({ fid }) => {
  return fetchSignerEvents({ fid: Number(fid) })
    .then((data) => {
      return data.events;
    })
    .catch((err) => {
      console.error(err);
    });
};

// TODO: replace this with http later
// export const fetchHubInfo = async ({ hubEndpoint = "" }) => {
//   const client = getClient(hubEndpoint);
//   return client
//     .getInfo({ dbStats: true })
//     .then((result) => {
//       if (result.isErr()) {
//         throw result.error;
//       }

//       return parseHubObject(result.value);
//     })
//     .catch((err) => {
//       console.error(err);
//       throw err;
//     });
// };

// export const fetchHubSyncStatus = async (peerId = "") => {
//   return farcasterClient
//     .getSyncStatus(peerId)
//     .then((result) => {
//       if (result.isErr()) {
//         throw result.error;
//       }

//       return parseHubObject(result.value);
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// };

// export const fetchHubSyncIdsByPrefix = async (prefix) => {
//   return farcasterClient
//     .getAllSyncIdsByPrefix({ prefix })
//     .then((result) => {
//       if (result.isErr()) {
//         throw result.error;
//       }

//       return result.value;
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// };

// export const fetchSignerEvent = async ({ fid, publicKey }) => {
//   return

// }

export const fetchAllUserCastMessages = async ({ fid, signer }) => {
  const params = new URLSearchParams({
    fid: Number(fid),
    reverse: true,
    pageSize: 100,
  });

  return hubFetch("/castsByFid?" + params)
    .then((data) => data.messages)
    .then((casts) => {
      if (signer) {
        return casts.filter((cast) => {
          return cast.signer == signer;
        });
      }

      return casts;
    })
    .catch((err) => {
      console.error(err);
    });
};

export const fetchAllUserReactionMessages = async ({ fid, signer }) => {
  const params = new URLSearchParams({
    fid: Number(fid),
    reverse: true,
    pageSize: 100,
  });

  return hubFetch("/reactionsByFid?" + params)
    .then((data) => data.messages)
    .then((reactions) => {
      if (signer) {
        return reactions.filter((message) => {
          return message.signer == signer;
        });
      }

      return reactions;
    })
    .catch((err) => {
      console.error(err);
    });
};

export const fetchFidByAddress = async (address) => {
  const params = new URLSearchParams({
    address,
  });

  return hubFetch("/onChainIdRegistryEventByAddress?" + params)
    .then((data) => {
      return data.fid;
    })
    .catch((err) => {
      console.error(err);
    });
};
