import { Footer } from "@/src/components/footer";
import Link from "next/link";

const HomeCard = ({ title, subtitle, link }) => {
  return (
    <div
      style={{
        border: "1px solid black",
        borderRadius: "4px",
        textAlign: "center",
        padding: "1.5rem",
      }}
    >
      <Link href={link}>
        <p>{title}</p>
        <p
          style={{
            color: "#222",
            fontSize: "0.8rem",
            textTransform: "lowercase",
          }}
        >
          {subtitle}
        </p>
      </Link>
    </div>
  );
};

export default function Home() {
  return (
    <>
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
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
              gridTemplateColumns: "15rem 15rem 15rem",
              gap: "2rem",
            }}
          >
            <HomeCard
              title="@varunsrin.eth"
              subtitle="/fid/:fid"
              link="/fid/2"
            />
            <HomeCard title="dwr.eth" subtitle="/:username" link="/dwr.eth" />

            <HomeCard
              title="Cast"
              subtitle="/cast/:hash"
              link="/cast/0x4f909cacf0d364ff8c495bf860092d5cb976a2b2"
            />

            <HomeCard
              title="Signers"
              subtitle="/fid/:fid/signers"
              link="/fid/2/signers"
            />

            <HomeCard
              title="Signer"
              subtitle="/fid/:fid/signer/:signer"
              link="/fid/2/signer/0x78ff9a768cf1fbb13caaf5159a9623dd2499b01592a0ee672eca647b6d62558c"
            />

            <HomeCard
              title="GetInfo (RPC)"
              subtitle="/rpc/:method"
              link="/rpc/getInfo"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
