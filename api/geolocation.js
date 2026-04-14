const stateNames = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapa",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceara",
  DF: "Distrito Federal",
  ES: "Espirito Santo",
  GO: "Goias",
  MA: "Maranhao",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Para",
  PB: "Paraiba",
  PR: "Parana",
  PE: "Pernambuco",
  PI: "Piaui",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondonia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "Sao Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

module.exports = (req, res) => {
  const forwardedFor = req.headers["x-forwarded-for"] || "";
  const ipFromHeader = typeof forwardedFor === "string" ? forwardedFor.split(",")[0].trim() : "";
  const ip = ipFromHeader || req.socket?.remoteAddress || "";

  const cityHeader = req.headers["x-vercel-ip-city"];
  const regionHeader = req.headers["x-vercel-ip-country-region"];
  const countryHeader = req.headers["x-vercel-ip-country"];

  const city = typeof cityHeader === "string" ? cityHeader : "";
  const regionCode = typeof regionHeader === "string" ? regionHeader.toUpperCase() : "";
  const countryCode = typeof countryHeader === "string" ? countryHeader.toUpperCase() : "";

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    ip,
    city,
    regionCode,
    regionName: stateNames[regionCode] || "",
    countryCode,
    countryName: countryCode === "BR" ? "Brasil" : "",
    source: "vercel-headers",
  });
};
