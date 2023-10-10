"use client";

export default function Error({ error, reset }) {
  let { message } = error;
  if (process.env.NODE_ENV === "production") {
    message = error.digest;
  }

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
        <pre>{JSON.stringify(message, null, 2)}</pre>
      </div>
    </div>
  );
}
