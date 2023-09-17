import { HubClient } from "@/src/components/hub-client";
import { MutedText } from "@/src/components/text";
import { fetchHubInfo } from "@/src/hooks/hub";
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

  let hubsInfo;
  if (hubs) {
    hubsInfo = await Promise.all(
      hubs.map(async (hubUrl) => {
        try {
          return await fetchHubInfo({ hubEndpoint: hubUrl });
        } catch (e) {
          return { errorMessage: e.message, ...e };
        }
      })
    );
  } else {
    const hubInfo = await fetchHubInfo({});
    hubsInfo = [hubInfo];
  }

  const mostSyncedHubStats = hubsInfo.reduce(
    (acc, curr) => {
      if (curr?.dbStats?.numMessages > acc.numMessages) return curr.dbStats;
      return acc;
    },
    { numMessages: 0 }
  );

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
          hubs.map((hubUrl, index) => (
            <HubClient
              key={hubUrl}
              rpcEndpoint={hubUrl}
              methodObject={rpcMethodObject}
              methodParams={parsedParams}
              inSyncStats={mostSyncedHubStats}
              hubInfo={hubsInfo[index]}
              {...searchParams}
            />
          ))
        ) : (
          <HubClient
            rpcEndpoint={process.env.FARCASTER_HUB_RPC_ENDPOINT}
            methodObject={rpcMethodObject}
            methodParams={parsedParams}
            hideEndpoint={true}
            hubInfo={hubsInfo[0]}
            {...searchParams}
          />
        )}
      </div>
    </div>
  );
}
