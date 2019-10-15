if ("geolocation" in navigator) {
  console.log("geolocation available");
  navigator.geolocation.getCurrentPosition(async position => {
    let latitude, longitude, weather, air;
    try {
      // const { latitude, longitude } = position.coords;

      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      document.getElementById("latitudine").textContent = latitude.toFixed(2);
      document.getElementById("longitudine").textContent = longitude.toFixed(2);

      const api_key = `weather/${latitude},${longitude}`;
      const response = await fetch(api_key);
      const json = await response.json();

      // const { weather, air_quality } = data;

      weather = json.weather.currently;
      air = json.air_quality.results[0].measurements[0];

      document.getElementById("summary").textContent = weather.summary;
      document.getElementById("temperature").textContent = weather.temperature;
      document.getElementById("summary").textContent = weather.summary;
      document.getElementById("aq_parameter").textContent = air.parameter;
      document.getElementById("aq_value").textContent = air.value;
      document.getElementById("aq_units").textContent = air.unit;
      document.getElementById("aq_date").textContent = air.lastUpdated;
    } catch (e) {
      console.error(e);
      air = { value: -1 };
      document.getElementById("aq_value").textContent = "No Reading";
    }

    const data = { latitude, longitude, weather, air };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const db_response = await fetch("/api", options);
    const db_json = await db_response.json();
    console.log(db_json);
  });
} else {
  console.error("geolocation not available");
}
