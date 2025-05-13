import { isHex } from "viem";
import axios from "axios";

const NEYNAR_V2_ENDPOINT = "https://api.neynar.com/v2/farcaster";

export const fetchUser = async (fid) => {
  const options = {
    method: "GET",
    url:
      NEYNAR_V2_ENDPOINT +
      "/user/bulk?" +
      new URLSearchParams({ fids: String(Number(fid)) }),
    headers: {
      "Content-Type": "application/json",
      api_key: process.env.NEYNAR_API_KEY,
      accept: "application/json",
    },
  };

  return axios
    .request(options)
    .then((response) => response.data)
    .then((data) => {
      if (data.status === 400) {
        throw new Error(data.message);
      }
      // v2 returns an array of users
      return Array.isArray(data.users) ? data.users[0] : undefined;
    })
    .catch((err) => {
      throw err;
    });
};

export const fetchUserByUsername = async (username) => {
  const options = {
    method: "GET",
    url:
      NEYNAR_V2_ENDPOINT +
      "/user/by_username?" +
      new URLSearchParams({ username }),
    headers: {
      "Content-Type": "application/json",
      api_key: process.env.NEYNAR_API_KEY,
      accept: "application/json",
    },
  };

  return axios
    .request(options)
    .then((response) => response.data)
    .then((data) => {
      if (data.status === 400) {
        throw new Error(data.message);
      }
      return data.user;
    })
    .catch((err) => {
      throw err;
    });
};

export const fetchV2Casts = async (castHashes) => {
  castHashes.map((castHash) => {
    if (!isHex(castHash)) {
      throw new Error(`cast hash is not hex: ${castHash}`);
    }
  });

  const options = {
    method: "GET",
    url:
      NEYNAR_V2_ENDPOINT +
      "/casts?" +
      new URLSearchParams({ casts: castHashes.join(",") }),
    headers: {
      "Content-Type": "application/json",
      api_key: process.env.NEYNAR_API_KEY,
      accept: "application/json",
    },
  };

  return axios
    .request(options)
    .then((response) => {
      return response.data;
    })
    .then((data) => {
      if (data.status == 400) {
        throw new Error(data.message);
      }
      return data.result.casts;
    })
    .catch((err) => {
      throw err;
    });
};
