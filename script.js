const southeastStates = {
  ES: "Espirito Santo",
  MG: "Minas Gerais",
  RJ: "Rio de Janeiro",
  SP: "Sao Paulo",
};

const stateToRegion = {
  AC: "Norte", AL: "Nordeste", AP: "Norte", AM: "Norte", BA: "Nordeste",
  CE: "Nordeste", DF: "Centro-Oeste", ES: "Sudeste", GO: "Centro-Oeste", MA: "Nordeste",
  MT: "Centro-Oeste", MS: "Centro-Oeste", MG: "Sudeste", PA: "Norte", PB: "Nordeste",
  PR: "Sul", PE: "Nordeste", PI: "Nordeste", RJ: "Sudeste", RN: "Nordeste",
  RS: "Sul", RO: "Norte", RR: "Norte", SC: "Sul", SP: "Sudeste",
  SE: "Nordeste", TO: "Norte",
};

const tourismByState = {
  ES: [
    {
      title: "Convento da Penha (ES)",
      description: "Um dos santuarios mais antigos do Brasil, com vista panoramica de Vila Velha.",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Convento_da_Penha%2C_Vila_Velha%2C_Espirito_Santo.jpg",
    },
    {
      title: "Pedra Azul (ES)",
      description: "Formacao rochosa simbolo da serra capixaba, cercada por paisagens naturais.",
      image: "https://upload.wikimedia.org/wikipedia/commons/2/24/Pedra_Azul%2C_Espirito_Santo.jpg",
    },
    {
      title: "Praia de Camburi (ES)",
      description: "Praia urbana de Vitoria, conhecida pelo calçadao e atividades ao ar livre.",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/46/Praia_de_Camburi%2C_Vitoria%2C_ES.jpg",
    },
  ],
  MG: [
    {
      title: "Praca da Liberdade (MG)",
      description: "Area historica de Belo Horizonte cercada por centros culturais e edificios tradicionais.",
      image: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Praca_da_Liberdade%2C_Belo_Horizonte.jpg",
    },
    {
      title: "Inhotim (MG)",
      description: "Museu de arte contemporanea a ceu aberto em Brumadinho, com grande jardim botanico.",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Inhotim_Brumadinho_MG.jpg",
    },
    {
      title: "Ouro Preto (MG)",
      description: "Cidade historica com arquitetura colonial e patrimonio cultural brasileiro.",
      image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Ouro_Preto_Minas_Gerais_Brazil.jpg",
    },
  ],
  RJ: [
    {
      title: "Cristo Redentor (RJ)",
      description: "O Cristo Redentor é uma estátua colossal de Jesus Cristo em estilo Art Déco, situada no topo do Morro do Corcovado, Rio de Janeiro. Inaugurado em 1931, possui 38 metros de altura total (30m da estátua + 8m de pedestal). Revestido de pedra-sabão, braços abertos simbolizam paz e proteção.",
      image: "img/Cristo_Redentor.jpg",
    },
    {
      title: "Pão de Açucar (RJ)",
      description: "O Pão de Açúcar, no Rio de Janeiro, é um dos cartões-postais mais famosos do mundo, composto por dois morros (Urca e Pão de Açúcar) com 395 metros de altura. A experiência principal envolve um passeio de bondinho (teleférico) que oferece vistas panorâmicas deslumbrantes de 360º da cidade, praias e baía de Guanabara.",
      image: "img/Pâo_de_Açucar.jpg",
    },
    {
      title: "Arcos da Lapa (RJ)",
      description: "Os Arcos da Lapa, ou Aqueduto da Carioca, são um marco colonial do século XVIII no Rio de Janeiro, com 270 metros de extensão e 42 arcos em estilo romano, construídos com pedra e cal para transportar água. Localizado na Lapa, o monumento funciona hoje como viaduto para os bondinhos de Santa Teresa e é um dos maiores cartões-postais da cidade.",
      image: "img/Arcos_da_Lapa.jpg",
    },
  ],
  SP: [
    {
      title: "Avenida Paulista (SP)",
      description: "Centro cultural e financeiro de Sao Paulo, com museus e grande movimento urbano.",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/87/Avenida_Paulista%2C_Sao_Paulo%2C_Brasil.jpg",
    },
    {
      title: "Parque Ibirapuera (SP)",
      description: "Principal parque urbano da capital paulista, com areas verdes e equipamentos culturais.",
      image: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Parque_Ibirapuera%2C_Sao_Paulo.jpg",
    },
    {
      title: "Mercado Municipal (SP)",
      description: "Ponto turistico conhecido pela arquitetura, gastronomia e tradicao no centro da cidade.",
      image: "https://upload.wikimedia.org/wikipedia/commons/7/74/Mercado_Municipal_de_Sao_Paulo.jpg",
    },
  ],
};

function normalizeText(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function inferRegionCodeFromName(regionName) {
  const regionByName = {
    "espirito santo": "ES",
    "minas gerais": "MG",
    "rio de janeiro": "RJ",
    "sao paulo": "SP",
  };

  return regionByName[normalizeText(regionName)] || "";
}

async function fetchGeolocation() {
  const providers = [
    {
      name: "ipapi",
      async request() {
        const response = await fetch("https://ipapi.co/json/");

        if (!response.ok) {
          throw new Error(`ipapi: HTTP ${response.status}`);
        }

        const data = await response.json();
        return {
          ip: data.ip || "",
          city: data.city || "",
          regionCode: (data.region_code || "").toUpperCase(),
          regionName: data.region || "",
          countryCode: (data.country || "").toUpperCase(),
          countryName: data.country_name || "",
        };
      },
    },
    {
      name: "ipwhois",
      async request() {
        const response = await fetch("https://ipwho.is/");

        if (!response.ok) {
          throw new Error(`ipwhois: HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.success === false) {
          throw new Error("ipwhois: resposta invalida do provedor");
        }

        return {
          ip: data.ip || "",
          city: data.city || "",
          regionCode: (data.region_code || "").toUpperCase(),
          regionName: data.region || "",
          countryCode: (data.country_code || "").toUpperCase(),
          countryName: data.country || "",
        };
      },
    },
    {
      name: "ipify-ipapi",
      async request() {
        const ipResponse = await fetch("https://api.ipify.org?format=json");

        if (!ipResponse.ok) {
          throw new Error(`ipify: HTTP ${ipResponse.status}`);
        }

        const ipData = await ipResponse.json();
        const ip = ipData.ip || "";

        if (!ip) {
          throw new Error("ipify: IP nao retornado");
        }

        const geoResponse = await fetch(
          `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,query`
        );

        if (!geoResponse.ok) {
          throw new Error(`ip-api: HTTP ${geoResponse.status}`);
        }

        const geoData = await geoResponse.json();

        if (geoData.status !== "success") {
          throw new Error(`ip-api: ${geoData.message || "consulta falhou"}`);
        }

        return {
          ip: geoData.query || ip,
          city: geoData.city || "",
          regionCode: (geoData.region || "").toUpperCase(),
          regionName: geoData.regionName || "",
          countryCode: (geoData.countryCode || "").toUpperCase(),
          countryName: geoData.country || "",
        };
      },
    },
  ];

  const errors = [];

  for (const provider of providers) {
    try {
      return await provider.request();
    } catch (error) {
      const message = error instanceof Error && error.message
        ? error.message
        : "erro desconhecido";
      errors.push(`${provider.name}: ${message}`);
    }
  }

  throw new Error(errors.join(" | ") || "Falha desconhecida ao consultar geolocalizacao");
}

function buildRegionMessage(regionCode, regionName) {
  if (southeastStates[regionCode]) {
    return {
      headline: "Voce esta na regiao Sudeste",
      message: `A UF ${regionCode} faz parte do Sudeste.`,
      extraInfo: `Estado identificado: ${southeastStates[regionCode]}.`,
    };
  }

  return {
    headline: "Voce nao esta na regiao Sudeste",
    message: `A UF ${regionCode || "nao informada"} nao faz parte do Sudeste.`,
    extraInfo: regionName
      ? `Estado identificado: ${regionName}.`
      : "Nao foi possivel identificar o estado.",
  };
}

function renderTourismCards(stateCode, stateName, tourismGrid, tourismTitle) {
  const places = tourismByState[stateCode] || [];

  tourismTitle.textContent = `Pontos turisticos de ${stateName || stateCode}`;
  tourismGrid.innerHTML = "";

  for (const place of places.slice(0, 3)) {
    tourismGrid.insertAdjacentHTML(
      "beforeend",
      `
        <article class="tourism-card">
          <img class="tourism-image" src="${place.image}" alt="${place.title}" loading="lazy" />
          <div class="tourism-text">
            <h4>${place.title}</h4>
            <p>${place.description}</p>
          </div>
        </article>
      `
    );
  }
}

function buildDynamicTourismCards(city, stateName, stateCode) {
  const placeLabel = city && city !== "Cidade desconhecida"
    ? `${city}, ${stateName || stateCode}`
    : stateName || stateCode;

  return [1, 2, 3].map((index) => ({
    title: `Ponto turistico ${index} - ${placeLabel}`,
    description: `Sugestao visual de atracao turistica em ${placeLabel}.`,
    image: `https://source.unsplash.com/900x600/?${encodeURIComponent(`${placeLabel} turismo brasil`)}&sig=${index}`,
  }));
}

function renderDynamicTourismCards(city, stateName, stateCode, tourismGrid, tourismTitle) {
  const places = buildDynamicTourismCards(city, stateName, stateCode);

  tourismTitle.textContent = `Pontos turisticos de ${stateName || stateCode}`;
  tourismGrid.innerHTML = "";

  for (const place of places) {
    tourismGrid.insertAdjacentHTML(
      "beforeend",
      `
        <article class="tourism-card">
          <img class="tourism-image" src="${place.image}" alt="${place.title}" loading="lazy" />
          <div class="tourism-text">
            <h4>${place.title}</h4>
            <p>${place.description}</p>
          </div>
        </article>
      `
    );
  }
}

async function identifyOrigin() {
  const button = document.getElementById("detect-button");
  const loading = document.getElementById("loading");
  const content = document.getElementById("content");
  const headline = document.getElementById("headline");
  const ipText = document.getElementById("ip-text");
  const locationText = document.getElementById("location-text");
  const messageText = document.getElementById("message-text");
  const extraInfo = document.getElementById("extra-info");
  const tourismButton = document.getElementById("tourism-button");
  const tourismSection = document.getElementById("tourism-section");
  const tourismTitle = document.getElementById("tourism-title");
  const tourismGrid = document.getElementById("tourism-grid");

  if (!button || !loading || !content || !headline || !ipText || !locationText || !messageText || !extraInfo || !tourismButton || !tourismSection || !tourismTitle || !tourismGrid) {
    return;
  }

  button.disabled = true;
  loading.hidden = false;
  content.hidden = true;
  tourismButton.hidden = true;
  tourismSection.hidden = true;
  tourismGrid.innerHTML = "";

  try {
    const origin = await fetchGeolocation();
    const ip = origin.ip || "Nao informado";
    const city = origin.city || "Cidade desconhecida";
    const regionCode = origin.regionCode || inferRegionCodeFromName(origin.regionName || "");
    const regionName = origin.regionName || "";
    const countryCode = origin.countryCode || "";
    const countryName = origin.countryName || "Pais nao identificado";
    const region = stateToRegion[regionCode] || "";
    const localizedStateName = southeastStates[regionCode] || regionName || regionCode;

    ipText.textContent = `IP de origem: ${ip}`;
    locationText.textContent = `${city} - ${regionCode || "--"}`;

    if (countryCode === "BR") {
      const result = buildRegionMessage(regionCode, regionName);
      headline.textContent = result.headline;
      messageText.textContent = result.message;
      extraInfo.textContent = result.extraInfo;

      if (countryCode === "BR" && regionCode) {
        tourismButton.hidden = false;
        tourismButton.textContent = `Ver 3 pontos turisticos de ${localizedStateName}`;
        tourismButton.onclick = () => {
          if (tourismByState[regionCode]) {
            renderTourismCards(regionCode, localizedStateName, tourismGrid, tourismTitle);
          } else {
            renderDynamicTourismCards(city, localizedStateName, regionCode, tourismGrid, tourismTitle);
          }

          tourismSection.hidden = false;
        };
      } else {
        tourismButton.hidden = true;
      }
    } else {
      headline.textContent = "Origem identificada fora do Brasil";
      messageText.textContent = "A consulta retornou um IP com localizacao internacional.";
      extraInfo.textContent = `Pais identificado: ${countryName}.`;
    }
  } catch (error) {
    const technicalReason = error instanceof Error && error.message
      ? error.message
      : "Erro de rede nao especificado";

    headline.textContent = "Falha ao identificar a origem";
    ipText.textContent = "IP de origem: indisponivel";
    locationText.textContent = "Localizacao indisponivel";
    messageText.textContent = "Nao foi possivel consultar o servico de geolocalizacao.";
    extraInfo.textContent = `Motivo tecnico: ${technicalReason}. Verifique internet, DNS ou bloqueio de rede.`;
  } finally {
    loading.hidden = true;
    content.hidden = false;
    button.disabled = false;
  }
}

const detectButton = document.getElementById("detect-button");

if (detectButton) {
  detectButton.addEventListener("click", identifyOrigin);
}
