
function renderTasks(tasks) {
    const taskList = document.getElementById("taskList");

    taskList.replaceChildren();

    if (tasks.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "Hozircha vazifalar mavjud emas.";
        taskList.appendChild(empty);
        return;
    }

    tasks.forEach(task => {
        const card = document.createElement("article");
        card.className = `task-card ${task.is_completed ? "completed" : ""}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.is_completed;
        checkbox.setAttribute("aria-label", "Vazifani bajarilgan deb belgilash");
        checkbox.dataset.action = "complete";
        checkbox.dataset.id = task.id;

        const info = document.createElement("div");
        info.className = "task-info";

        const title = document.createElement("h3");
        title.textContent = task.title;

        const description = document.createElement("p");
        description.textContent = task.description || "Tavsif mavjud emas";

        info.append(title, description);

        const priority = document.createElement("span");
        priority.className = `priority ${task.priority}`;
        priority.textContent = task.priority.toUpperCase();

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const edit = document.createElement("button");
        edit.type = "button";
        edit.textContent = "✎";
        edit.title = "Tahrirlash";
        edit.dataset.action = "edit";
        edit.dataset.id = task.id;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "✕";
        remove.title = "O'chirish";
        remove.className = "delete-button";
        remove.dataset.action = "delete";
        remove.dataset.id = task.id;

        actions.append(edit, remove);
        card.append(checkbox, info, priority, actions);

        taskList.appendChild(card);
    });
}


function updateStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(task => task.is_completed).length;
    const remaining = total - completed;

    const percent = total
        ? Math.round((completed / total) * 100)
        : 0;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("remainingTasks").textContent = remaining;

    document.getElementById("progressPercent").textContent = `${percent}%`;
    document.getElementById("progressBar").style.width = `${percent}%`;
}


function updateDate() {
    const date = new Date();

    document.getElementById("currentDate").textContent =
        date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
}
