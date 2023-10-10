"use client";

export default function Error({ error, reset }) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2>Oops, something went wrong!</h2>
      <div>
        <pre>{JSON.stringify(error?.message || error, null, 2)}</pre>
      </div>
    </div>
  );
}
