import { MutedText } from "./text";
import { fetchCast as fetchHubCast } from "@/src/hooks/hub";

export default async function HubResponse({ castHash, fid, hub }) {
  let hubResponse;

  try {
    const resp = await fetchHubCast({
      hash: castHash,
      fid: fid,
      endpoint: hub.endpoint,
    });

    hubResponse = {
      title: hub.hub,
      endpoint: hub.endpoint,
      response: resp,
    };
  } catch (e) {
    hubResponse = {
      title: hub.hub,
      endpoint: hub.endpoint,
      response: e,
      errorMessage: e.message,
      ...e,
    };
  }

  return (
    <div>
      <h2 style={{ marginBottom: "0rem" }}>{hubResponse.title}</h2>
      <MutedText>{hubResponse.endpoint}</MutedText>
      <pre>
        {JSON.stringify(
          hubResponse.errorMessage
            ? hubResponse.response?.message
            : hubResponse.response,
          null,
          2
        )}
      </pre>
    </div>
  );
}
