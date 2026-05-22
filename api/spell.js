// api/spell.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { version, champion } = req.query;

  const r = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/pl_PL/champion/${champion}.json`
  );
  const data = await r.json();
  res.status(200).json(data);
}
