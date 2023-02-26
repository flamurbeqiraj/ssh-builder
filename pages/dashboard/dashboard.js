let project_list = JSON.parse(localStorage.getItem("project_list"));
const table_list = document.querySelector("#list");
const add_project = document.querySelector("#add_project");
const log_area = document.querySelector(".logarea");
const prezone = document.querySelector("#prezone");

function initializeProjects() {
    if (project_list !== null) {
        if (project_list.length > 0) {
            table_list.innerHTML = "";
            let i = 1;
            for (let item of project_list) {
                table_list.innerHTML += `<tr class="item_row">
                    <td>${i}</td>
                    <td>
                        <i class="bi bi-play-circle-fill text-success cursor-pointer build"></i>
                    </td>
                    <td>${item.project_name}</td>
                    <td>${item.last_build_date || "--"}</td>
                    <td>${item.last_build_state || "--"}</td>
                    <td class="text-center"><i class="bi bi-x-lg text-danger cursor-pointer remove_project"></i><i class="bi bi-sliders2 text-primary cursor-pointer edit_project ms-2"></i></td>
                </tr>`;
                i++;
            }
        } else {
            table_list.innerHTML = `<tr>
                    <td colspan="6" class="text-center"><i>Empty list</i></td>
                </tr>`;
        }
    } else {
        table_list.innerHTML = `<tr>
            <td colspan="6" class="text-center"><i>Register your first project</i></td>
        </tr>`;
    }
}

add_project.addEventListener("click", async () => {
    window.location.href = "../register/register.html";
})

document.addEventListener("click", async function(e) {
    let rowElement = e.target.parentElement;
    if (e.target.classList.contains("remove_project")) {
        let list = project_list;
        let removeIndex = e.target.closest("tr").rowIndex;
        list.splice(removeIndex-1, 1);
        project_list = list;
        localStorage.setItem("project_list", JSON.stringify(list))
        initializeProjects();
    }

    if (e.target.classList.contains("edit_project")) {
        let selected_item = e.target.closest("tr").rowIndex;
        window.location.href = `../edit/edit.html?id=${project_list[selected_item - 1].uuid}`;
    }

    if (e.target.classList.contains("build")) {
        let selected_item = e.target.closest("tr").rowIndex;
        prezone.innerText = "Executing commands...";
        log_area.classList.remove("d-none");
        rowElement.innerHTML = '<div class="spinner-border spinner-border-sm small-loader" role="status"><span class="sr-only"></span></div>';
        let build_steps = project_list[selected_item - 1].build_param;
        let local_repo = project_list[selected_item - 1].local_repo;
        let starter = "cd "+local_repo;
        prezone.innerText = "";
        let i = 0;
        for (let item of build_steps) {
            if (i > 0) {
                prezone.innerText += "\n\n\n";
            }
            prezone.innerText += "===================== Executing: "+item+" =====================\n";
            let cmd_output = await window.electronAPI.execCommand(starter+" && "+item);
            prezone.innerText += cmd_output;
            i++;
            log_area.scrollTo(0, log_area.scrollHeight);
        }
        prezone.innerText += "\n\nClearing remote folder & data transfer...";
        let feedback = await window.electronAPI.sshFilesTransfer(project_list[selected_item-1]);
        if (feedback) {
            prezone.innerText += "\n\nUpload status: "+feedback;
            if (project_list[selected_item-1].has_envfile) {
                let env_file = await window.electronAPI.createEnvFile(project_list[selected_item-1]);
                if (env_file.stderr === "") {
                    prezone.innerText += "\n\nCreated environment file";
                }
            }
        }
        prezone.innerText += "\nBuild process completed.";
        rowElement.innerHTML = '<i class="bi bi-play-circle-fill text-success cursor-pointer build"></i>';
        log_area.scrollTo(0, log_area.scrollHeight);        
    }
});

initializeProjects();