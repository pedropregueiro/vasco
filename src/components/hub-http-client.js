import { MutedText } from "./text";
import { parseResult } from "../utils/hub";
import { DiffToggle } from "./diff-toggle";
import { hubFetch } from "../hooks/hub";

const bigNumberFormatter = new Intl.NumberFormat();

export const HubHttpClient = async ({
  httpEndpoint,
  methodObject,
  methodParams,
  hubInfo,
  inSyncStats,
  hideEndpoint = false,
}) => {
  if (hubInfo.errorMessage) {
    return (
      <div>
        <h2 style={{ color: "#de554f" }}>{httpEndpoint}</h2>
        <p>Error: {hubInfo.errorMessage}</p>
      </div>
    );
  }

  const hubNumMessages = hubInfo.dbStats?.numMessages || 0;

  const hubSyncMessageDiff = inSyncStats
    ? hubNumMessages - inSyncStats.numMessages
    : 0;
  const hubSyncPercent = hubSyncMessageDiff / hubInfo.dbStats?.numMessages;

  const params = new URLSearchParams();
  Object.entries(methodParams).forEach(([key, value]) => {
    params.append(key, value);
  });

  let result;
  let error;
  try {
    result = await hubFetch({
      path: methodObject.path + "?" + params.toString(),
    });
  } catch (e) {
    error = e;
  }

  return (
    <div>
      <h2 style={{ color: error ? "#de554f" : "inherit" }}>
        {hubInfo.nickname}
      </h2>
      <MutedText style={{ marginTop: "0.4rem" }}>
        {hubInfo.peerId} (v{hubInfo.version})
      </MutedText>
      {!hideEndpoint && (
        <MutedText style={{ marginTop: "0.4rem" }}>{httpEndpoint}</MutedText>
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

      <h3 style={{ marginTop: "3rem" }}>{error ? "Error" : "Result"}</h3>

      <pre>{JSON.stringify(error ? error.message : result, null, 2)}</pre>
    </div>
  );
};
