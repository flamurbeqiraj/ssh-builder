const project_list = localStorage.getItem("project_list");
const project_name = document.getElementById('project_name')
const localrepo = document.getElementById('localrepo')
const clear_local = document.getElementById('clear_local')
const dist_path = document.getElementById('dist_path')
const dist_project = document.getElementById('dist_project')
const remote_url = document.getElementById('remote_url')
const build_param = document.getElementById('build_param')
const register = document.getElementById('register')
const go_back = document.getElementById('go_back')
const platformName = await window.electronAPI.getPlatformName();

register.addEventListener('click', async () => {
    let error_list = [];
    if (project_name.value.length < 3) {
        error_list.push(error_list.length+1+". Your project name should have more than 3 chars!")
    }
    if (localrepo.innerText === undefined || localrepo.innerText === "" || localrepo.innerText === "Not choosen") {
        error_list.push(error_list.length+1+". Please select a repository on you machine!")
    }
    if (dist_path.innerText === undefined || dist_path.innerText === "" || dist_path.innerText === "Not choosen") {
        error_list.push(error_list.length+1+". Please select destribution path of your app!")
    }
    if (dist_project.value.length <= 3) {
        error_list.push(error_list.length+1+". Specify the project name!")
    }
    if (remote_url.value === "" || remote_url.value.length < 7) {
        error_list.push(error_list.length+1+". Specify where the dist files should be moved!")
    }

    if (error_list.length === 0) {
        let new_list = JSON.parse(project_list);
        let item = {
            project_name: project_name.value,
            local_repo: localrepo.innerText,
            dist: dist_path.innerText+dist_project.value,
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
    if (platformName === "win32") {
        loadWindowsDirectory();
    } else if (platformName === "mac") {
        loadMacDirectory();
    } else {
        alert("Platform not defined: ", platformName);
    }
});

async function loadWindowsDirectory() {
    const filePath = await window.electronAPI.openFile()
    if (filePath !== undefined) {
        let project_name = filePath.split("\\");
        project_name = project_name[project_name.length-1];
        localrepo.innerText = filePath;
        dist_path.innerText = filePath+"\\";
        dist_project.value = "dist\\"+project_name.toLowerCase();
    }
}

async function loadMacDirectory() {
    const filePath = await window.electronAPI.openFile()
    if (filePath !== undefined) {
        let project_name = filePath.split("/");
        project_name = project_name[project_name.length-1];
        localrepo.innerText = filePath;
        dist_path.innerText = filePath+"/";
        dist_project.value = "dist/"+project_name.toLowerCase();
    }
}

clear_local.addEventListener('click', async () => {
    localrepo.innerText = "Not choosen"
    dist_path.innerText = "Not choosen"
})

go_back.addEventListener('click', async () => {
    window.location.href = "../dashboard/dashboard.html";
})