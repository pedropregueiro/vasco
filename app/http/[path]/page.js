import { MutedText } from "@/src/components/text";
import { parseHttpPathString } from "@/src/utils/hub";
import { fetchHubInfo } from "@/src/hooks/hub";
import { parseParams, prettyParams } from "@/src/utils/hub";
import { HubHttpClient } from "@/src/components/hub-http-client";

export const revalidate = 0;

export default async function HTTP({ params, searchParams }) {
  const { path } = params;

  const httpMethodObject = parseHttpPathString(path);
  const parsedParams = parseParams({
    methodObject: httpMethodObject,
    params: searchParams,
    rpc: false,
  });
  const prettifiedParams = prettyParams({
    methodParams: parsedParams,
    rpc: false,
  });

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
        <h2>{httpMethodObject.title}</h2>
        <MutedText>args: {prettifiedParams}</MutedText>
      </div>

      <div className="two-column-grid">
        {hubs ? (
          hubs.map((hubUrl, index) => (
            <HubHttpClient
              key={hubUrl}
              httpEndpoint={hubUrl}
              methodObject={httpMethodObject}
              methodParams={parsedParams}
              inSyncStats={mostSyncedHubStats}
              hubInfo={hubsInfo[index]}
              {...searchParams}
            />
          ))
        ) : (
          <HubHttpClient
            httpEndpoint={process.env.FARCASTER_HUB_HTTP_ENDPOINT}
            methodObject={httpMethodObject}
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
