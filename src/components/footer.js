export const Footer = () => {
  return (
    <div
      style={{
        height: "5rem",
        marginTop: "-5rem",
        backgroundColor: "rgb(245, 243, 228)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          gap: "0.3rem",
        }}
      >
        <p>Made with ❤️ by</p>
        <a
          href="https://warpcast.com/pedropregueiro"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontWeight: "bold" }}
        >
          prego.eth
        </a>
      </div>
    </div>
  );
};
