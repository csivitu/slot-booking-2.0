export const getTime = (date: string) => {
  const options = {
    hour: <"2-digit" | "numeric" | undefined>"2-digit",
    minute: <"2-digit" | "numeric" | undefined>"2-digit",
    hour12: true,
    timeZone: "IST",
  };
  return new Date(date).toLocaleString("en-US", options);
};
