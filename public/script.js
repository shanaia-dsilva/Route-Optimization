var total_proj=0, optim_num=0, savings=0;
var project_count=0;

total_projects=document.getElementById('total-projects-num');;
optim=document.getElementById('routes-num');
save=document.getElementById('savings-num');

total_projects.innerHTML=total_proj;
optim.innerHTML=optim_num;
save.innerHTML=savings+"%";