document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const overlay = document.getElementById("project-overlay");
  const projectNameInput = document.getElementById("projectName");
  const submitBtn = document.getElementById("submitProjectName");
  const dragArea = document.querySelector('.drag-area');
  const dragText = document.querySelector('.header');
  const input = document.querySelector('input[type="file"]');
  const btn = document.querySelector('.button');
  const loadingOverlay = document.getElementById("loadingOverlay");
  const form = document.querySelector("form");

  let file;

  // Focus on project name input on load
  window.onload = () => {
    projectNameInput.focus();
  };

  // Handle project name submit
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

  // Section highlight on scroll
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

  // File input browse button
  btn.onclick = () => input.click();

  input.addEventListener('change', function () {
    file = this.files[0];
  });

  // Drag & drop area
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

    const projectName = localStorage.getItem("projectName");
    if (!projectName) {
      alert("Project name is missing.");
      return;
    }

    if (!input.files[0]) {
      alert("Please upload a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", input.files[0]);

    loadingOverlay.style.display = "flex";

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
      loadingOverlay.style.display = "none";
    }
  });
});
