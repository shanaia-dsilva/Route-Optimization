

// Project name input 
// document.addEventListener("DOMContentLoaded", () => {
// const overlay = document.getElementById("project-overlay");
// const projectNameInput = document.getElementById("projectName");
// const submitBtn = document.getElementById("submitProjectName");

// window.onload = () => {
//   projectNameInput.focus();
// };

// function handleProjectSubmit () {
//   const name = projectNameInput.value.trim();
//   if (name) {
//     overlay.style.display = "none"; // hide overlay
//     // Store for later use (optional)
//     localStorage.setItem("projectName", name);
//   } else {
//     alert("Please enter a project name.");
//   }
//     document.getElementById('project-title').textContent=name;
// }
// // submitBtn.addEventListener("click", () => {
// submitBtn.addEventListener("click", handleProjectSubmit);
  
// projectNameInput.addEventListener("keydown", (event) => {
//   if (event.key === "Enter") {
//     handleProjectSubmit();
//   }
// });
// function changeProjectName() {

// }

  // active section effect
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
// });

// input browse button
let file;

let btn=document.querySelector('.button');
let input=document.querySelector('input[type="file"]');

btn.onclick = () => {
  input.click();
}

input.addEventListener ('change', function () {
  file=this.files[0];
})
// Drag & drop area features
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
    file = event.dataTransfer.files[0];

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

// back end integration with mysql-connector

// sending it to backend
// 👇 Get the project name from localStorage (set earlier after user input)
const projectName = localStorage.getItem("projectName");

const formData = new FormData();
formData.append("file", file); // replace with actual file object reference

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


