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

const dragArea=document.querySelector('.drag-area');
const dragText=document.querySelector('.header');

dragArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dragArea.classList.add('active');
});

dragArea.addEventListener('dragleave', () => {
    
    dragArea.classList.remove('active');
    
});

dragArea.addEventListener('drop', (event) => {
    event.preventDefault();
    file=event.dataTransfer.files[0];
    let fileType=file.type;
    let validExt=['csv'];
    if(validExt.includes(fileType)) {
        let fileReader=new fileReader();
        fileReader.onload = () => {
            let fileUrl=fileReader.result;
            console.log( fileUrl);
        };
        fileReader.readAsDefaultURL(file);
    }
    else {
        document.getElementById('file-stat').innerHTML='Please upload a .csv file only';
        alert('Invalid file');
    }
});
