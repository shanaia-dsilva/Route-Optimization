async function getOsrmDistance(lat1, lon1, lat2, lon2) {
  const url = `http://localhost:5000/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return (data.routes?.[0]?.distance / 1000).toFixed(2); // in km
  } catch (err) {
    console.error("OSRM error:", err);
    return "ERROR";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector('input[type="file"]');
  const browseButton = document.querySelector(".button");
  const form = document.querySelector("form");
  const table = document.querySelector(".data_head");

  browseButton.addEventListener("click", () => input.click());

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = input.files[0];
    if (!file) return alert("Please choose a CSV file first");

    const reader = new FileReader();
    reader.onload = async (event) => {
      const lines = event.target.result.trim().split("\n");
      const headers = lines[0].split(",");
      if (headers.length < 5) {
        alert("CSV should have: Vehicle, lat1, lon1, lat2, lon2");
        return;
      }

      // Preview table header
      table.innerHTML = "";
      const headerRow = document.createElement("tr");
      [...headers, "Distance_1_to_2_km", "Distance_2_to_1_km"].forEach(h => {
        const th = document.createElement("th");
        th.textContent = h.trim();
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      // Process rows
      for (let i = 1; i < Math.min(lines.length, 10); i++) { // limit to top 10
        const row = lines[i].split(",");
        const [veh, lat1, lon1, lat2, lon2] = row;
        const d1 = await getOsrmDistance(+lat1, +lon1, +lat2, +lon2);
        const d2 = await getOsrmDistance(+lat2, +lon2, +lat1, +lon1);
        const tr = document.createElement("tr");
        [...row, d1, d2].forEach(cell => {
          const td = document.createElement("td");
          td.textContent = cell;
          tr.appendChild(td);
        });
        table.appendChild(tr);
      }

      // Generate CSV for download
      const fullOutput = [headers.join(",") + ",Dist1to2_km,Dist2to1_km"];
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(",");
        const [lat1, lon1, lat2, lon2] = row.slice(1); // assuming these are columns 2–5
        const d1 = await getOsrmDistance(+lat1, +lon1, +lat2, +lon2);
        const d2 = await getOsrmDistance(+lat2, +lon2, +lat1, +lon1);
        fullOutput.push(`${lines[i]},${d1},${d2}`);
      }

      const blob = new Blob([fullOutput.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const downloadBtn = document.createElement("a");
      downloadBtn.href = url;
      downloadBtn.download = "osrm_output.csv";
      downloadBtn.className = "download-btn";
      downloadBtn.textContent = "Download Processed CSV";
      document.getElementById("file-stat").appendChild(downloadBtn);
    };

    reader.readAsText(file);
  });
});
