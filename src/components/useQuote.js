import { randFromArray } from "../function/random";

const getQuotes = async () => {
  const response = await fetch("https://type.fit/api/quotes");
  const data = await response.json();

  return data;
};

export const randQuote = async () => {
  const quotes = await getQuotes();
  return randFromArray(quotes);
};
