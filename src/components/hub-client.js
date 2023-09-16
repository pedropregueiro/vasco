import { getSSLHubRpcClient } from "@farcaster/hub-nodejs";
import { MutedText } from "./text";
import { parseParams } from "../utils/hub";

export const HubClient = async ({
  rpcEndpoint,
  methodObject,
  methodParams,
}) => {
  const formatter = new Intl.NumberFormat();

  const farcasterClient = getSSLHubRpcClient(rpcEndpoint, {
    metadata: false,
  });

  const hubInfoResult = await farcasterClient.getInfo({ dbStats: true });
  if (hubInfoResult.isErr()) {
    return (
      <div>
        <h2 style={{ color: "#de554f" }}>{rpcEndpoint}</h2>
        <p>Error: {hubInfoResult.error.message}</p>
      </div>
    );
  }

  const hubInfo = hubInfoResult.value;
  const result = await farcasterClient[methodObject.method](methodParams);

  return (
    <div>
      <h2 style={{ color: result.isErr() ? "#de554f" : "inherit" }}>
        {hubInfo.nickname}
      </h2>
      <MutedText style={{ marginTop: "0.4rem" }}>
        {hubInfo.peerId} (v{hubInfo.version})
      </MutedText>
      <MutedText style={{ marginTop: "0.4rem" }}>{rpcEndpoint}</MutedText>

      <p>{formatter.format(hubInfo.dbStats?.numMessages)} messages</p>

      <h3 style={{ marginTop: "3rem" }}>
        {result.isErr() ? "Error" : "Result"}
      </h3>

      <pre>
        {JSON.stringify(result.isErr() ? result.error : result.value, null, 2)}
      </pre>
    </div>
  );
};
