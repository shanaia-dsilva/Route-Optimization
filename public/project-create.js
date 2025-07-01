
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("csv-input");
  const btn = document.querySelector(".button");
  const headDiv = document.querySelector(".data_head");
  const form = document.querySelector("#csv-form");
  const status = document.getElementById("status");

  btn.onclick = () => input.click();

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file || !file.name.endsWith(".csv")) {
      status.textContent = "Please select a valid CSV file.";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.trim().split(/\r?\n/);
      if (rows.length < 1) {
        headDiv.innerHTML = "<p>No data found in CSV.</p>";
        return;
      }

      const headers = rows[0].split(",").map(h => h.trim());
      const previewRows = rows.slice(1, 6).map(row => row.split(","));

      const table = `
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${previewRows.map(row => `<tr>${headers.map((_, i) => `<td>${row[i] || ""}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      `;
      headDiv.innerHTML = table;
    };

    reader.readAsText(file);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = input.files[0];
    if (!file) {
      status.textContent = "Please select a CSV file first.";
      return;
    }

    status.textContent = "Uploading and processing...";

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/calculate", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error:", errorText);
        throw new Error("Upload failed with status " + res.status);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "osrm_output.csv";
      link.click();

      status.textContent = "File processed and downloaded.";
    } catch (err) {
      console.error("Upload error:", err);
      status.textContent = "Something went wrong during upload.";
    }
  });
});
