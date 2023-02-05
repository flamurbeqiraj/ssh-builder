const project_list = localStorage.getItem("project_list");
const table_list = document.querySelector("#list");
const add_project = document.querySelector("#add_project");

if (project_list !== null) {
    let list = JSON.parse(project_list);
    console.log("list", list);
    if (list.length > 0) {
        table_list.innerHTML = "";
        let i = 1;
        for (let item of list) {
            table_list.innerHTML += 
            `<tr>
                <td>${i}</td>
                <td><i class="bi bi-play-circle-fill text-success cursor-pointer"></i></td>
                <td>${item.project_name}</td>
                <td>03.02.2023 15:30</td>
                <td>Succeed!</td>
            </tr>`;
            i++;
        }
    } else {
        table_list.innerHTML = 
            `<tr>
                <td colspan="5" class="text-center"><i>Empty list</i></td>
            </tr>`;
    }
} else {
    table_list.innerHTML = 
    `<tr>
        <td colspan="5" class="text-center"><i>Register your first project</i></td>
    </tr>`;
}

add_project.addEventListener("click", () => {
    window.location.href = "../register/register.html";
})