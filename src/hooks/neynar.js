import { isHex } from "viem";
import axios from "axios";

const NEYNAR_V1_ENDPOINT = "https://api.neynar.com/v1/farcaster";
const NEYNAR_V2_ENDPOINT = "https://api.neynar.com/v2/farcaster";

const DEFAULT_PAGE_SIZE = 50;

export const fetchCast = async (castHash) => {
  if (!isHex(castHash)) {
    throw new Error("cast id is not hex");
  }

  const params = new URLSearchParams({
    api_key: process.env.NEYNAR_API_KEY,
    hash: castHash,
  });

  const response = await fetch(NEYNAR_V1_ENDPOINT + "/cast?" + params);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.result.cast;
};

export const fetchUser = async (fid) => {
  const params = new URLSearchParams({
    api_key: process.env.NEYNAR_API_KEY,
    fid: Number(fid),
  });

  return fetch(NEYNAR_V1_ENDPOINT + "/user?" + params)
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      return data.result?.user;
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

export const fetchCustodyAddress = async (fid) => {
  const params = new URLSearchParams({
    api_key: process.env.NEYNAR_API_KEY,
    fid,
  });

  return fetch(NEYNAR_V1_ENDPOINT + "/custody-address?" + params)
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      return data.result;
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
    url: NEYNAR_V2_ENDPOINT + "/casts?",
    headers: {
      "Content-Type": "application/json",
      api_key: process.env.NEYNAR_API_KEY,
      accept: "application/json",
    },
    data: {
      casts: castHashes.map((castHash) => {
        return { hash: castHash };
      }),
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
