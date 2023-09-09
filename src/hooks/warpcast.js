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

  return fetch(WARPCAST_API_ENDPOINT + "/cast?" + params, {
    headers: WARPCAST_AUTH_HEADERS,
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      return data.result.cast;
    })
    .catch((err) => {
      throw err;
    });
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
      return data.result.user;
    })
    .catch((err) => {
      throw err;
    });
};