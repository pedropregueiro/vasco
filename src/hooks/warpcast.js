import { isHex } from "viem";

const WARPCAST_API_ENDPOINT = "https://api.warpcast.com/v2";

const WARPCAST_AUTH_HEADERS = {
  accept: "application/json",
  authorization: "Bearer " + process.env.WARPCAST_API_TOKEN,
};

export const fetchCast = async (castHash) => {
  if (!isHex(castHash)) {
    throw new Error("cast id is not hex");
  }

  const params = new URLSearchParams({
    hash: castHash,
  });

  const response = await fetch(WARPCAST_API_ENDPOINT + "/cast?" + params, {
    headers: WARPCAST_AUTH_HEADERS,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.errors[0].message);
  }

  return data.result.cast;
};

export const fetchUser = async (fid) => {
  const params = new URLSearchParams({
    fid,
  });

  return fetch(WARPCAST_API_ENDPOINT + "/user?" + params, {
    headers: WARPCAST_AUTH_HEADERS,
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      if (data.errors) {
        return data;
      }

      return data.result.user;
    })
    .catch((err) => {
      throw err;
    });
};

export const fetchUserThreadCasts = async ({
  hashPrefix,
  username,
  limit = 10,
}) => {
  const params = new URLSearchParams({
    castHashPrefix: hashPrefix,
    username,
    limit,
  });

  return fetch(WARPCAST_API_ENDPOINT + "/user-thread-casts?" + params, {
    headers: WARPCAST_AUTH_HEADERS,
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      return data.result.casts;
    })
    .catch((err) => {
      throw err;
    });
};
