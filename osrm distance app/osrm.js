document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector('input[type="file"]');
  const browseButton = document.querySelector(".button");
  const form = document.querySelector("form");
  const fileStat = document.getElementById("file-stat");

  // Browse button opens file picker
  browseButton.addEventListener("click", () => input.click());

  // Form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = input.files[0];
    if (!file) {
      alert("Please select a CSV file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/calculate", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Upload failed:", res.status, errText);
        alert("Something went wrong while processing your file.\n" + errText);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const downloadBtn = document.createElement("a");
      downloadBtn.href = url;
      downloadBtn.download = "osrm_result.csv";
      downloadBtn.className = "download-btn";
      downloadBtn.textContent = "Download Processed CSV";

      fileStat.appendChild(downloadBtn);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading file.");
    }
  });
});
