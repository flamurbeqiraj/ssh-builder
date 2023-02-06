let project_list = JSON.parse(localStorage.getItem("project_list"));
const table_list = document.querySelector("#list");
const add_project = document.querySelector("#add_project");

function initializeProjects() {
    if (project_list !== null) {
        if (project_list.length > 0) {
            table_list.innerHTML = "";
            let i = 1;
            for (let item of project_list) {
                table_list.innerHTML += 
                `<tr class="item_row">
                    <td>${i}</td>
                    <td><i class="bi bi-play-circle-fill text-success cursor-pointer"></i></td>
                    <td>${item.project_name}</td>
                    <td>03.02.2023 15:30</td>
                    <td>Succeed!</td>
                    <td class="text-center"><i class="bi bi-x-lg text-danger cursor-pointer remove_project"></i></td>
                </tr>`;
                i++;
            }
        } else {
            table_list.innerHTML = 
                `<tr>
                    <td colspan="6" class="text-center"><i>Empty list</i></td>
                </tr>`;
        }
    } else {
        table_list.innerHTML = 
        `<tr>
            <td colspan="6" class="text-center"><i>Register your first project</i></td>
        </tr>`;
    }
}

add_project.addEventListener("click", () => {
    window.location.href = "../register/register.html";
})

document.addEventListener("click", function(e){
    if (e.target.classList.contains("remove_project")) {
        let list = project_list;
        let removeIndex = e.target.closest("tr").rowIndex;
        list.splice(removeIndex-1, 1);
        project_list = list;
        localStorage.setItem("project_list", JSON.stringify(list))
        initializeProjects();
    }
});

initializeProjects();