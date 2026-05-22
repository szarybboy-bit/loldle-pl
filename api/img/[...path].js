// api/img/[...path].js
// Proxy obrazków dla Discord Activity — przekazuje obrazki z Data Dragon przez Vercel.
// Obsługuje ścieżki:
//   /api/img/champion/Ahri.png        → champion square icon
//   /api/img/splash/Ahri_0.jpg        → champion splash art
//   /api/img/spell/AhriSeduce.png     → spell icon
//   /api/img/passive/Ahri_P1.png      → passive icon
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=86400'); // cache 24h — obrazki się nie zmieniają

  const pathParts = req.query.path; // tablica segmentów
  if (!pathParts || pathParts.length === 0) {
    return res.status(400).json({ error: 'Brak ścieżki obrazka' });
  }

  const type = pathParts[0]; // 'champion', 'splash', 'spell', 'passive'
  const filename = pathParts[1];

  if (!filename) {
    return res.status(400).json({ error: 'Brak nazwy pliku' });
  }

  let imageUrl;

  try {
    if (type === 'splash') {
      // Splash art — nie wymaga wersji
      imageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${filename}`;
    } else {
      // Pozostałe obrazki wymagają wersji
      const verRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
      const versions = await verRes.json();
      const version = versions[0];

      if (type === 'champion') {
        imageUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${filename}`;
      } else if (type === 'spell') {
        imageUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${filename}`;
      } else if (type === 'passive') {
        imageUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${filename}`;
      } else {
        return res.status(400).json({ error: `Nieznany typ obrazka: ${type}` });
      }
    }

    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      return res.status(imgRes.status).json({ error: 'Błąd pobierania obrazka' });
    }

    const contentType = imgRes.headers.get('content-type') || 'image/png';
    res.setHeader('Content-Type', contentType);

    const buffer = await imgRes.arrayBuffer();
    res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
