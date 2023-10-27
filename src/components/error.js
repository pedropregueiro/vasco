"use client;";

const FullPageError = ({ errorMessage }) => {
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
        <pre>{errorMessage}</pre>
      </div>
    </div>
  );
};

export default FullPageError;
