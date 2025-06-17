function uploadFile() {
  const input = document.getElementById('fileInput');
  const file = input.files[0];
  const formData = new FormData();
  formData.append("file", file);

  fetch("http://localhost:8000/optimize", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('resultBox').textContent = JSON.stringify(data.result, null, 2);
  });
}

var total_proj=0, optim_num=0, savings=0;
var project_count=0;

total_projects=document.getElementById('total-projects-num');;
optim=document.getElementById('routes-num');
save=document.getElementById('savings-num');

total_projects.innerHTML=total_proj;
optim.innerHTML=optim_num;
save.innerHTML=savings+"%";
