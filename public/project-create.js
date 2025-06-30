document.addEventListener("DOMContentLoaded", () => {
 
  const overlay = document.getElementById("project-overlay");
  const projectNameInput = document.getElementById("projectName");
  const submitBtn = document.getElementById("submitProjectName");
  const dragArea = document.querySelector('.drag-area');
  const dragText = document.querySelector('.header');
  const input = document.querySelector('input[type="file"]');
  const btn = document.querySelector('.button');
  const loadingOverlay = document.getElementById("loadingOverlay");
  const form = document.querySelector("form");
  const headDiv = document.querySelector(".data_head");

  let file;

  // project name focus on load
  window.onload = () => {
    projectNameInput.focus();
  };

  // handle project name submit
  function handleProjectSubmit() {
    const name = projectNameInput.value.trim();
    if (name) {
      overlay.style.display = "none";
      localStorage.setItem("projectName", name);
      document.getElementById('project-title').textContent = name;
    } else {
      alert("Please enter a project name.");
    }
  }

  submitBtn.addEventListener("click", handleProjectSubmit);

  projectNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleProjectSubmit();
    }
  });

  // active section feature
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-list");

  const removeActiveClasses = () => {
    navLinks.forEach(link => link.classList.remove("active"));
  };

  const addActiveClass = (id) => {
    navLinks.forEach(link => {
      const anchor = link.querySelector("a");
      if (anchor && anchor.getAttribute("href") === `#${id}`) {
        link.classList.add("active");
      }
    });
  };

  const onScroll = () => {
    let currentSectionId = "";
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom >= 150) {
        currentSectionId = section.id;
      }
    });

    if (currentSectionId) {
      removeActiveClasses();
      addActiveClass(currentSectionId);
    }
  };

  window.addEventListener("scroll", onScroll);

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
  // file inpt browse button
  btn.onclick = () => input.click();

  input.addEventListener('change', function () {
    file = this.files[0];
  });

  // drag & drop area
  dragArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dragArea.classList.add('active');
  });

  dragArea.addEventListener('dragleave', () => {
    dragArea.classList.remove('active');
  });

  dragArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dragArea.classList.remove('active');

    const droppedFile = event.dataTransfer.files[0];

    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      input.files = event.dataTransfer.files;
      file = droppedFile;

      const reader = new FileReader();
      reader.onload = () => console.log("CSV content preview:", reader.result);
      reader.readAsText(droppedFile);
    } else {
      document.getElementById('file-stat').innerHTML = 'Please upload a .csv file only';
      alert('Invalid file');
    }
  });

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", input.files[0]);

    const projectName = localStorage.getItem("projectName");
    loadingOverlay.style.display = "flex";
    document.querySelector('.loading-message').textContent="Uploading..";

    try {
      const res = await fetch(`http://localhost:8000/optimize?project_name=${encodeURIComponent(projectName)}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Upload success:", data);

      //preview of data.head()
      
      if (data.head && Array.isArray(data.head) && data.head.length > 0) {
        const headers = Object.keys(data.head[0]);
        const table = `
          <table border="1" cellpadding="5" cellspacing="0">
            <thead>
              <tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${data.head.map(row => `
                <tr>${headers.map(h => `<td>${row[h]}</td>`).join("")}</tr>
              `).join("")}
            </tbody>
          </table>
        `;
        headDiv.innerHTML = table;
      } else {
        headDiv.innerHTML = "<p>No preview available.</p>";
      }

    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      loadingOverlay.style.display = "none";
    }
  });
});



