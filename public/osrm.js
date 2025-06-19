document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("csv-form");
  const input = document.getElementById("csv-input");
  const browseBtn = document.querySelector(".button");
  const status = document.getElementById("status");

  // Click "browse" text triggers file input
  browseBtn.addEventListener("click", () => input.click());

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
