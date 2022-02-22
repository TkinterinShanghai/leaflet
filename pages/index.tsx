import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import { apiResponseType } from "../types/apiResponseType";

function HomePage({ ipInfo }: { ipInfo: apiResponseType }) {
  const Map = dynamic(() => import("../components/Map"), { ssr: false });

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      <div style={{ margin: "auto", width: "50%" }}>
        <h2 style={{ margin: "auto", width: "fit-content", marginBottom: "10px" }}>
          Momentaner Standort ist {ipInfo.city}
        </h2>
        <Map center={[ipInfo.latitude, ipInfo.longitude]} />
      </div>
    </div>
  );
}

const getLocation = async (ip: string) => {
  let response = await fetch(
    `https://api.freegeoip.app/json/${ip}?apikey=${process.env.API_KEY}`
  );
  return (await response.json()) as apiResponseType;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let ip =
    process.env.NODE_ENV === "production"
      ? (context.req.headers["x-real-ip"] as string) || context.req.socket.remoteAddress
      : "";
  const ipInfo = await getLocation(ip!);
  return {
    props: { ipInfo },
  };
}

export default HomePage;
