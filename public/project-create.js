document.addEventListener("DOMContentLoaded", () => {
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
});

const dragArea = document.querySelector('.drag-area');
const dragText = document.querySelector('.header');

dragArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dragArea.classList.add('active');
});

dragArea.addEventListener('dragleave', () => {
    dragArea.classList.remove('active');
});

dragArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dragArea.classList.remove('active'); // Optional: reset UI
    let file = event.dataTransfer.files[0];

    if (file && file.name.endsWith('.csv')) {
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let fileContent = fileReader.result;
            console.log(fileContent); // or handle the CSV content
        };
        fileReader.readAsText(file); // best for reading CSV
    } else {
        document.getElementById('file-stat').innerHTML = 'Please upload a .csv file only';
        alert('Invalid file');
    }
});


const projectNameInput = document.getElementById("projectName");

const formData = new FormData();
formData.append("file", yourCsvFile); // replace `yourCsvFile` with actual file object

const projectName = projectNameInput.value.trim();

fetch(`http://localhost:8000/optimize?project_name=${encodeURIComponent(projectName)}`, {
  method: "POST",
  body: formData,
})
.then(res => res.json())
.then(data => {
  console.log("Upload success:", data);
})
.catch(err => {
  console.error("Upload failed:", err);
});

