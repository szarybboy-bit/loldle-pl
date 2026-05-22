// api/champions.js
// Proxy dla Discord Activity — Data Dragon jest blokowany przez sandbox Discorda.
// Ten endpoint pobiera dane po stronie serwera Vercel i przekazuje je do klienta.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600'); // cache 1h na Vercelu

  try {
    const verRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = await verRes.json();
    const version = versions[0];

    const dataRes = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/pl_PL/champion.json`
    );
    const data = await dataRes.json();

    res.status(200).json({ version, data: data.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
