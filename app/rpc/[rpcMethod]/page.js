import { HubClient } from "@/src/components/hub-client";
import { MutedText } from "@/src/components/text";
import {
  parseParams,
  parseRPCMethodString,
  prettyParams,
} from "@/src/utils/hub";

export const revalidate = 0;

export default async function RPC({ params, searchParams }) {
  const { rpcMethod } = params;

  const rpcMethodObject = parseRPCMethodString(rpcMethod);
  const parsedParams = parseParams(rpcMethodObject, searchParams);
  const prettifiedParams = prettyParams(parsedParams);

  const hubs = searchParams.compare?.split(",");
  if (hubs?.length >= 5) throw "too many hubs...";

  return (
    <div>
      <div
        style={{
          padding: "2rem",
          backgroundColor: "rgb(245, 243, 228)",
        }}
      >
        <h2>{rpcMethodObject.title}</h2>
        <MutedText>args: {prettifiedParams}</MutedText>
      </div>

      <div className="two-column-grid">
        {hubs ? (
          hubs.map((hubUrl) => (
            <HubClient
              key={hubUrl}
              rpcEndpoint={hubUrl}
              methodObject={rpcMethodObject}
              methodParams={parsedParams}
              {...searchParams}
            />
          ))
        ) : (
          <HubClient
            rpcEndpoint={process.env.FARCASTER_HUB_RPC_ENDPOINT}
            methodObject={rpcMethodObject}
            methodParams={parsedParams}
            hideEndpoint={true}
            {...searchParams}
          />
        )}
      </div>
    </div>
  );
}
