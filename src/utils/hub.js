import { hexToBytes, toHex } from "viem";
import { Message, OnChainEvent } from "@farcaster/hub-nodejs";

const AVAILABLE_HTTP_METHODS = {
  info: {
    id: "info",
    title: "Info",
    path: "/info?dbstats=1",
    params: [],
  },
  castbyid: {
    id: "castById",
    title: "CastById",
    path: "/castById",
    params: ["hash", "fid"],
  },
  userdatabyfid: {
    id: "userdatabyfid",
    title: "UserDataByFid",
    path: "/userDataByFid",
    params: ["fid"],
  },
};

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
  getonchainsignersbyfid: {
    id: "getonchainsignersbyfid",
    title: "GetOnChainSignersByFid",
    method: "getOnChainSignersByFid",
    params: ["fid"],
    resultField: "events",
    resultClass: [OnChainEvent],
  },
};

export const parseHttpPathString = (pathString) => {
  const methodObj = AVAILABLE_HTTP_METHODS[pathString.toLowerCase()];
  if (!methodObj) {
    throw "invalid http method";
  }

  return methodObj;
};

export const parseRPCMethodString = (methodString) => {
  const methodObj = AVAILABLE_RPC_METHODS[methodString.toLowerCase()];
  if (!methodObj) {
    throw "invalid rpc method";
  }

  return methodObj;
};

export const parseParams = ({ methodObject, params, rpc = true }) => {
  const paramObj = {};

  methodObject.params?.forEach((param) => {
    if (!params[param]) throw "missing param";

    let value = params[param];
    if (param == "hash" && rpc) value = hexToBytes(value);
    if (param == "fid") value = Number(value);

    paramObj[param] = value;
  });

  return paramObj;
};

export const prettyParams = ({ methodParams, rpc = true }) => {
  let prettyParams = {};
  for (const [key, value] of Object.entries(methodParams)) {
    let prettyValue = value;
    if (key == "hash" && rpc) prettyValue = toHex(value);
    if (key == "fid") prettyValue = Number(value);

    prettyParams[key] = prettyValue;
  }

  return JSON.stringify(prettyParams, null, 2);
};

export const parseResult = async (methodObject, result) => {
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
    return await parseHubObjects(resultValue);
  }

  return await parseHubObject(resultValue);
};

const parseValue = async (value) => {
  // if is type buffer, return hex
  if (Buffer.isBuffer(value)) return toHex(value);
  return value;
};

export const parseHubObject = async (object) => {
  // for each key, value in the object, parse the value
  const parsedObject = {};

  for (const [key, value] of Object.entries(object)) {
    if (ArrayBuffer.isView(value)) {
      parsedObject[key] = await parseValue(value);
      continue;
    }

    // if it's an array, parse each element as an object
    if (Array.isArray(value)) {
      const parsedArray = [];
      for (const element of value) {
        const parsedElement = await parseHubObject(element);
        parsedArray.push(parsedElement);
      }

      parsedObject[key] = parsedArray;
      continue;
    }

    // if it's an object, parse it as an object
    if (typeof value === "object") {
      const parsedValue = await parseHubObject(value);
      parsedObject[key] = parsedValue;
      continue;
    }

    const parsedValue = await parseValue(value);
    parsedObject[key] = parsedValue;
  }

  return parsedObject;
};

export const parseHubObjects = async (objects) => {
  return await Promise.all(
    objects.map(async (o) => {
      return await parseHubObject(o);
    })
  );
};
