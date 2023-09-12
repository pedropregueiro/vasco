import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <h2>Vasco</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "10rem 10rem",
            columnGap: "2rem",
          }}
        >
          <Link
            href="/fid/3"
            style={{
              border: "1px solid black",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            <p>@dwr.eth</p>
            <p
              style={{
                color: "#222",
                fontSize: "0.8rem",
                textTransform: "lowercase",
              }}
            >
              /fid/:fid
            </p>
          </Link>
          <Link
            href="/cast/0x4f909cacf0d364ff8c495bf860092d5cb976a2b2"
            style={{
              border: "1px solid black",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            <p>Vitalik's cast</p>
            <p
              style={{
                color: "#222",
                fontSize: "0.8rem",
                textTransform: "lowercase",
              }}
            >
              /cast/:hash
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
