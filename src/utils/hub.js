import { hexToBytes, toHex } from "viem";
import { Message } from "@farcaster/hub-nodejs";

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
    resultClass: Message,
  },
  getalluserdatamessagesbyfid: {
    id: "getalluserdatamessagesbyfid",
    title: "GetAllUserDataMessagesByFid",
    method: "getAllUserDataMessagesByFid",
    params: ["fid"],
  },
  getuserdatabyfid: {
    id: "getuserdatabyfid",
    title: "GetUserDataByFid",
    method: "getUserDataByFid",
    params: ["fid"],
    resultField: "messages",
    resultClass: [Message],
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

export const parseResult = (methodObject, result) => {
  if (result.isErr()) return result.error;
  if (!methodObject.resultClass) return result.value;

  const resultField = methodObject.resultField;
  const resultClass = methodObject.resultClass;

  let resultValue = result.value;
  // if resultField is set, then we have to get the value from the result
  if (resultField) {
    resultValue = result.value[resultField];
  }

  // if type of resultClass is array, then we have to map over the result
  if (Array.isArray(resultClass)) {
    const toUseClass = resultClass[0];
    return resultValue.map((element) => {
      return toUseClass.toJSON(element);
    });
  }

  return resultClass.toJSON(resultValue);
};
