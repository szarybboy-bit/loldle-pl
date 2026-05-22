// api/spell.js
// Proxy dla Discord Activity — pobiera dane czarów konkretnego championa.
// Używany przez tryb Umiejętność i Ultimate "R".
// Wywołanie: /api/spell?champion=Ahri
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600'); // cache 1h na Vercelu

  const { champion } = req.query;
  if (!champion) {
    return res.status(400).json({ error: 'Brak parametru champion' });
  }

  try {
    const verRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = await verRes.json();
    const version = versions[0];

    const dataRes = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/pl_PL/champion/${champion}.json`
    );
    const data = await dataRes.json();

    res.status(200).json({ version, ...data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
