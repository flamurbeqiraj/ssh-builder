import Tags from "../../node_modules/bootstrap5-tags/tags.js";

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const project_list = localStorage.getItem("project_list");
const project_name = document.getElementById('project_name')
const localrepo = document.getElementById('localrepo')
const clear_local = document.getElementById('clear_local')
const dist_path = document.getElementById('dist_path')
const dist_project = document.getElementById('dist_project')
const remote_url = document.getElementById('remote_url')
const build_param = document.getElementById('build_param')
const update = document.getElementById('update')
const go_back = document.getElementById('go_back')
const has_env_file = document.getElementById('has_environmental_file')
const env_filename = document.getElementById('env_filename')
const env_filecontent = document.getElementById('env_filecontent')
const env_contents = document.querySelectorAll('.env-zone')
const platformName = await window.electronAPI.getPlatformName();

let id = params.id;
let entry = JSON.parse(localStorage.getItem("project_list")).find((x) => x.uuid === id);

update.addEventListener('click', async () => {
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
        let new_list = JSON.parse(project_list).filter((x) => x.uuid !== entry.uuid);
        let item = {
            uuid: entry.uuid,
            project_name: project_name.value,
            local_repo: localrepo.innerText,
            dist_path: dist_path.innerText,
            dist_project: dist_project.value,
            remote_url: remote_url.value,
            has_envfile: has_env_file.checked,
            build_param: Array.from(build_param.selectedOptions, option => option.value)
        };

        if (has_env_file) {
            item.env_filename = env_filename.value;
            item.env_filecontent = env_filecontent.value;
        }

        new_list.push(item);

        localStorage.setItem("project_list", JSON.stringify(new_list))
        alert("Your project has been updated successfuly!");
        window.location.href = "../dashboard/dashboard.html"
    } else {
        alert(error_list.join("\n"));
    }
})

function patch_values() {
    project_name.value = entry.project_name;
    localrepo.innerText = entry.local_repo;
    dist_path.innerText = entry.dist_path;
    dist_project.value = entry.dist_project;
    remote_url.value = entry.remote_url;
    has_env_file.checked = entry.has_envfile;
    for (let item of env_contents) {
        if (has_env_file.checked) {
            item.classList.remove("d-none");
            item.classList.add("d-block");
            env_filename.value = entry.env_filename;
            env_filecontent.value = entry.env_filecontent;
        } else {
            item.classList.remove("d-block");
            item.classList.add("d-none");
        }
    }
    let build_option_list = `<option value="">Type a build step tag...</option>`;
    if (entry.build_param.length > 0) {
        for (let item of entry.build_param) {
            build_option_list += `<option value="${item}" selected="selected">${item}</option>`;
        }
    }
    build_param.innerHTML = build_option_list;
    Tags.init();
}

patch_values();

localrepo.addEventListener('click', async () => {
    if (platformName === "win32") {
        loadWindowsDirectory();
    } else if (platformName === "darwin") {
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

has_env_file.addEventListener('change', (e) => {
    let isChecked = e.target.checked;
    for (let item of env_contents) {
        if (isChecked) {
            item.classList.remove("d-none");
            item.classList.add("d-block");
        } else {
            item.classList.remove("d-block");
            item.classList.add("d-none");
        }
    }
})