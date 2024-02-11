import { decodeAbiParameters, toHex } from "viem";

const KEY_METADATA_TYPE = [
  {
    components: [
      {
        internalType: "uint256",
        name: "requestFid",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "requestSigner",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    internalType: "struct SignedKeyRequestValidator.SignedKeyRequestMetadata",
    name: "metadata",
    type: "tuple",
  },
];

export const decodeMetadata = (metadata) => {
  if (!metadata) return;

  if (typeof metadata === "string") {
    metadata = Buffer.from(metadata, "base64");
  }

  // if metadata is of type buffer, convert to hex
  if (Buffer.isBuffer(metadata)) {
    metadata = toHex(metadata);
  }

  const parsedMetadata = decodeAbiParameters(KEY_METADATA_TYPE, metadata);
  return parsedMetadata;
};
