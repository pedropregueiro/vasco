import { getSSLHubRpcClient, HubError } from "@farcaster/hub-nodejs";
import { MutedText } from "./text";
import { parseResult } from "../utils/hub";
import { DiffToggle } from "./diff-toggle";

const bigNumberFormatter = new Intl.NumberFormat();

export const HubClient = async ({
  rpcEndpoint,
  methodObject,
  methodParams,
  hubInfo,
  inSyncStats,
  hideEndpoint = false,
}) => {
  if (hubInfo.errorMessage) {
    return (
      <div>
        <h2 style={{ color: "#de554f" }}>{rpcEndpoint}</h2>
        <p>Error: {hubInfo.errorMessage}</p>
      </div>
    );
  }

  const hubNumMessages = hubInfo.dbStats?.numMessages || 0;

  const hubSyncMessageDiff = inSyncStats
    ? hubNumMessages - inSyncStats.numMessages
    : 0;
  const hubSyncPercent = hubSyncMessageDiff / hubInfo.dbStats?.numMessages;

  const farcasterClient = getSSLHubRpcClient(rpcEndpoint, {
    metadata: false,
  });
  const result = await farcasterClient[methodObject.method](methodParams);
  const parsedResult = await parseResult(methodObject, result);

  return (
    <div>
      <h2 style={{ color: result.isErr() ? "#de554f" : "inherit" }}>
        {hubInfo.nickname}
      </h2>
      <MutedText style={{ marginTop: "0.4rem" }}>
        {hubInfo.peerId} (v{hubInfo.version})
      </MutedText>
      {!hideEndpoint && (
        <MutedText style={{ marginTop: "0.4rem" }}>{rpcEndpoint}</MutedText>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          alignItems: "center",
          columnGap: "1rem",
        }}
      >
        <p>
          {bigNumberFormatter.format(hubInfo.dbStats?.numMessages)} messages
        </p>
        {hubSyncMessageDiff != 0 && (
          <DiffToggle
            diffNumber={hubSyncMessageDiff}
            diffPercentage={hubSyncPercent}
          />
        )}
      </div>

      <h3 style={{ marginTop: "3rem" }}>
        {result.isErr() ? "Error" : "Result"}
      </h3>

      <pre>{JSON.stringify(parsedResult, null, 2)}</pre>
    </div>
  );
};
