export const hubFetch = async ({ path, options, endpoint }) => {
  options = options || { headers: { "content-type": "application/json" } };

  if (endpoint) {
    if (endpoint.includes("neynar")) {
      options.headers["api_key"] = process.env.NEYNAR_API_KEY;
    }

    if (!endpoint.includes("v1")) {
      endpoint = endpoint + "/v1";
    }
  } else {
    options.headers["api_key"] = process.env.NEYNAR_API_KEY;
  }

  const baseEndpoint = endpoint || process.env.FARCASTER_HUB_HTTP_ENDPOINT;

  const response = await fetch(`${baseEndpoint}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    console.error(data);
    return Promise.reject(
      new Error(`${response.status} ${data.message ?? data.details}`)
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
  return hubFetch({ path: "/onChainSignersByFid?" + params });
};

export const fetchCast = async ({ fid, hash }) => {
  const params = new URLSearchParams({
    fid: Number(fid),
    hash: hash,
  });

  return hubFetch({ path: "/castById?" + params });
};

export const fetchUserData = async (fid) => {
  const params = new URLSearchParams({
    fid: Number(fid),
  });

  return hubFetch({ path: "/userDataByFid?" + params });
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

export const fetchHubInfo = async ({ hubEndpoint }) => {
  return hubFetch({ path: "/info?dbstats=1", endpoint: hubEndpoint });
};

export const fetchAllUserCastMessages = async ({ fid, signer }) => {
  const params = new URLSearchParams({
    fid: Number(fid),
    reverse: true,
    pageSize: 100,
  });

  return hubFetch({ path: "/castsByFid?" + params })
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

  return hubFetch({ path: "/reactionsByFid?" + params })
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

  return hubFetch({ path: "/onChainIdRegistryEventByAddress?" + params })
    .then((data) => {
      return data.fid;
    })
    .catch((err) => {
      console.error(err);
    });
};
