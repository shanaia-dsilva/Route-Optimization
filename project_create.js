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
});
