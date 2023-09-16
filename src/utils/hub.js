import { hexToBytes, toHex } from "viem";

const AVAILABLE_RPC_METHODS = {
  getinfo: {
    id: "getinfo",
    title: "GetInfo",
    method: "getInfo",
  },
  getcast: {
    id: "getcast",
    title: "GetCast",
    method: "getCast",
    params: ["hash", "fid"],
  },
};

export const parseRPCMethodString = (methodString) => {
  const methodObj = AVAILABLE_RPC_METHODS[methodString.toLowerCase()];
  if (!methodObj) {
    throw "invalid rpc method";
  }

  return methodObj;
};

export const parseParams = (methodObject, params) => {
  const paramObj = {};
  methodObject.params?.forEach((param) => {
    let value = params[param];
    if (param == "hash") value = hexToBytes(value);
    if (param == "fid") value = Number(value);

    paramObj[param] = value;
  });

  return paramObj;
};

export const prettyParams = (methodParams) => {
  let prettyParams = {};
  for (const [key, value] of Object.entries(methodParams)) {
    let prettyValue = value;
    if (key == "hash") prettyValue = toHex(value);
    if (key == "fid") prettyValue = Number(value);

    prettyParams[key] = prettyValue;
  }

  return JSON.stringify(prettyParams, null, 2);
};

export const parseResult = (result) => {};
