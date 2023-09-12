import { isHex } from "viem";

const NEYNAR_V1_ENDPOINT = "https://api.neynar.com/v1/farcaster";

const DEFAULT_PAGE_SIZE = 50;

export const fetchCast = async (castHash) => {
  if (!isHex(castHash)) {
    throw new Error("cast id is not hex");
  }

  const params = new URLSearchParams({
    api_key: process.env.NEYNAR_API_KEY,
    hash: castHash,
  });

  return fetch(NEYNAR_V1_ENDPOINT + "/cast?" + params)
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
    api_key: process.env.NEYNAR_API_KEY,
    fid,
  });

  return fetch(NEYNAR_V1_ENDPOINT + "/user?" + params)
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

export const fetchUserByUsername = async (username) => {
  const params = new URLSearchParams({
    api_key: process.env.NEYNAR_API_KEY,
    username,
  });

  return fetch(NEYNAR_V1_ENDPOINT + "/user-by-username?" + params)
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
