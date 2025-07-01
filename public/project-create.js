// Existing DOMContentLoaded stays the same
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("csv-input");
  const btn = document.querySelector(".button");
  const form = document.querySelector("form");
  const headDiv = document.querySelector(".data_head");
  const status = document.getElementById("status");

  // Browse button triggers file dialog
  btn.onclick = () => input.click();

  // Handle file selection and preview generation
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split(/\r?\n/).filter(r => r.trim() !== "");
      if (rows.length === 0) {
        headDiv.innerHTML = "<p>No data in CSV file.</p>";
        return;
      }

      const headers = rows[0].split(",");
      const numRows = Math.min(6, rows.length - 1);

      const table = document.createElement("table");
      table.border = "1";
      table.cellPadding = "5";
      table.cellSpacing = "0";

      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");
      headers.forEach(h => {
        const th = document.createElement("th");
        th.textContent = h.trim();
        headRow.appendChild(th);
      });
      thead.appendChild(headRow);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      for (let i = 1; i <= numRows; i++) {
        const row = rows[i].split(",");
        const tr = document.createElement("tr");
        headers.forEach((_, j) => {
          const td = document.createElement("td");
          td.textContent = row[j] ? row[j].trim() : "";
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      }

      table.appendChild(tbody);
      headDiv.innerHTML = "";
      headDiv.appendChild(table);
    };
    reader.readAsText(file);
  });

  // Keep your existing form submission code untouched
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", input.files[0]);

    const projectName = localStorage.getItem("projectName") || "Unnamed Project";
    document.getElementById("loadingOverlay").style.display = "flex";
    document.querySelector(".loading-message").textContent = "Uploading...";

    try {
      const res = await fetch(`http://localhost:8000/optimize?project_name=${encodeURIComponent(projectName)}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Upload success:", data);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      document.getElementById("loadingOverlay").style.display = "none";
    }
  });
});
