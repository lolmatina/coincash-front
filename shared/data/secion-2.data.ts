import axios, { AxiosResponse } from "axios";

export type Card = {
  title: string;
  subtitle: string;
  amount: number;
  difference: number;
  last_updated_at: number;
};

const getData = async (): Promise<AxiosResponse> => {
  const corsProxy = "https://corsproxy.io/?";
  const url = encodeURIComponent(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin,polkadot&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true"
  );

  try {
    const result = await axios.get(`${corsProxy}${url}`);
    console.log(result.data);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getDataArray = async (): Promise<Card[]> => {
  const response = await getData();
  const data = response.data;

  return [
    {
      title: "Bitcoin",
      subtitle: "BTC",
      amount: data.bitcoin.usd,
      difference: data.bitcoin.usd_24h_change,
      last_updated_at: data.bitcoin.last_updated_at,
    },
    {
      title: "Ethereum",
      subtitle: "ETH",
      amount: data.ethereum.usd,
      difference: data.ethereum.usd_24h_change,
      last_updated_at: data.ethereum.last_updated_at,
    },
    {
      title: "Litecoin",
      subtitle: "LTC",
      amount: data.litecoin.usd,
      difference: data.litecoin.usd_24h_change,
      last_updated_at: data.litecoin.last_updated_at,
    },
    {
      title: "Polkadot",
      subtitle: "DOT",
      amount: data.polkadot.usd,
      difference: data.polkadot.usd_24h_change,
      last_updated_at: data.polkadot.last_updated_at,
    },
  ];
};
