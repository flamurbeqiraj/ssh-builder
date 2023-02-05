const project_list = localStorage.getItem("project_list");
const project_name = document.getElementById('project_name')
const localrepo = document.getElementById('localrepo')
const clear_local = document.getElementById('clear_local')
const dist = document.getElementById('dist')
const clear_dist = document.getElementById('clear_dist')
const remote_url = document.getElementById('remote_url')
const build_param = document.getElementById('build_param')
const register = document.getElementById('register')
const go_back = document.getElementById('go_back')

register.addEventListener('click', async () => {
    let error_list = [];
    if (project_name.value.length < 3) {
        error_list.push(error_list.length+1+". Your project name should have more than 3 chars!")
    }
    if (localrepo.innerText === undefined || localrepo.innerText === "" || localrepo.innerText === "Not choosen") {
        error_list.push(error_list.length+1+". Please select a repository on you machine!")
    }
    if (dist.innerText === undefined || dist.innerText === "" || dist.innerText === "Not choosen") {
        error_list.push(error_list.length+1+". Please select destribution path of your app!")
    }
    if (remote_url.value === "" || remote_url.value.length < 7) {
        error_list.push(error_list.length+1+". Specify where the dist files should be moved!")
    }

    if (error_list.length === 0) {
        let new_list = JSON.parse(project_list);
        let item = {
            project_name: project_name.value,
            local_repo: localrepo.innerText,
            dist: dist.innerText,
            remote_url: remote_url.value,
            build_param: build_param.value
        };
        if (new_list === null) {
            new_list = [item];
        } else {
            new_list.push(item);
        }
        localStorage.setItem("project_list", JSON.stringify(new_list))
        alert("Your project has been added successfuly!");
        window.location.href = "../dashboard/dashboard.html"
    } else {
        alert(error_list.join("\n"));
    }
})

localrepo.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openFile()
    if (filePath !== undefined) {
        localrepo.innerText = filePath;
    }
})

dist.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openFile()
    if (filePath !== undefined) {
        dist.innerText = filePath;
    }
})

clear_local.addEventListener('click', async () => {
    localrepo.innerText = "Not choosen"
})

clear_dist.addEventListener('click', async () => {
    dist.innerText = "Not choosen"
})

go_back.addEventListener('click', async () => {
    window.location.href = "../dashboard/dashboard.html";
})