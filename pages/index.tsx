import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import { apiResponseType } from "../types/apiResponseType";

function HomePage({ ipInfo }: { ipInfo: apiResponseType }) {
  const Map = dynamic(() => import("../components/Map"), { ssr: false });

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      <div style={{ margin: "auto", width: "50%" }}>
        <h2 style={{margin: "auto", width: "fit-content", marginBottom: "10px"}}>Momentaner Standort ist {ipInfo.city}</h2>
        <Map center={[ipInfo.latitude, ipInfo.longitude]} />
      </div>
    </div>
  );
}

const getLocation = async () => {
  let response = await fetch(`https://api.freegeoip.app/json/?apikey=${process.env.API_KEY}`);
  return (await response.json()) as apiResponseType;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const ipInfo = await getLocation();
  return {
    props: { ipInfo },
  };
}

export default HomePage;
