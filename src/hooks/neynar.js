import { isHex } from "viem";

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
