const map = L.map("myMap").setView([0, 0], 2);

const tileURL = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
const attribution =
  "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreamMap</a>";
const tiles = L.tileLayer(tileURL, { attribution }).addTo(map);

async function getData() {
  const response = await fetch("/api");
  const data = await response.json();

  for (item of data) {
    const marker = L.marker([item.latitude, item.longitude]).addTo(map);

    let txt = `<p>Latitudine: ${item.latitude}&deg;<br>
    Longitudine: ${item.longitude}&deg;</p>
<p>Il clima è ${item.weather.summary} con una temperatura di ${item.weather.temperature}° C.`;

    if (item.air.value < 0) {
      txt += ` - No air quality - .`;
    } else {
      txt += `<br>La
      concentrazione di polveri (${item.air.parameter}) è ${item.air.value} ${item.air.unit} ultimo
      rilievo ${item.air.lastUpdated}`;
    }

    marker.bindPopup(txt);
  }

  console.log(data);
}

getData();
