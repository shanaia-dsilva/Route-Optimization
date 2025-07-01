// const form = document.getElementById("csv-form");
// const input = document.getElementById("file-input");
// const browseBtn = document.querySelector(".button");
// const uploadBtn= document.querySelector(".upload-btn");


// Handle file input and drag-and-drop functionality

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("csv-form");
  const input = document.getElementById("file-input");
  const browseBtn = document.querySelector(".button");
  const status = document.getElementById("status");
  const previewTable = document.querySelector(".data_head");

  // Click "browse" triggers file input
  browseBtn.addEventListener("click", () => input.click());

  // Show CSV preview when file is selected
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const lines = text.trim().split("\n");
      previewTable.innerHTML = ""; // Clear old preview

      lines.slice(0, 6).forEach((line, index) => {
        const row = document.createElement("tr");
        line.split(",").forEach((cell) => {
          const td = document.createElement(index === 0 ? "th" : "td");
          td.textContent = cell.trim();
          row.appendChild(td);
        });
        previewTable.appendChild(row);
      });
    };

    reader.readAsText(file);
  });

  // Handle form submission
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
      console.error(err);
      status.textContent = "Something went wrong during upload.";
    }
  });
});
