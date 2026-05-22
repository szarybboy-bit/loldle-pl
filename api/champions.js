// api/champions.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const verRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
  const versions = await verRes.json();
  const version = versions[0];

  const dataRes = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/pl_PL/champion.json`
  );
  const data = await dataRes.json();

  res.status(200).json({ version, data: data.data });
}
