
let tasks = [];
let currentFilter = "all";
let editingTaskId = null;

async function loadTasks() {
    try {
        tasks = await getTasks();
        renderTasks(getFilteredTasks());
        updateStats(tasks);
    } catch (error) {
        console.error(error);

        document.getElementById("taskList").textContent =
            "API bilan bog'lanib bo'lmadi. Serverni tekshiring.";
    }
}


function getFilteredTasks() {
    if (currentFilter === "active") {
        return tasks.filter(task => !task.is_completed);
    }

    if (currentFilter === "completed") {
        return tasks.filter(task => task.is_completed);
    }

    if (currentFilter === "today") {
        const today = new Date().toDateString();

        return tasks.filter(task =>
            new Date(task.created_at).toDateString() === today
        );
    }

    return tasks;
}


function refreshTasks() {
    renderTasks(getFilteredTasks());
    updateStats(tasks);
}


// Add and Edit

document.getElementById("openTaskForm").addEventListener("click", () => {
    editingTaskId = null;

    document.getElementById("taskForm").reset();
    document.getElementById("taskForm").classList.remove("hidden");
    document.getElementById("taskTitle").focus();
});

document.getElementById("cancelTask").addEventListener("click", () => {
    document.getElementById("taskForm").classList.add("hidden");
    editingTaskId = null;
});


document.getElementById("taskForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();
    const priority = document.getElementById("taskPriority").value;

    if (!title) return;

    const data = {
        title,
        description,
        priority
    };

    try {
        if (editingTaskId !== null) {
            await updateTask(editingTaskId, data);
        } else {
            await createTask(data);
        }

        document.getElementById("taskForm").reset();
        document.getElementById("taskForm").classList.add("hidden");

        editingTaskId = null;

        await loadTasks();

    } catch (error) {
        alert(error.message);
    }
});


// Task actions

document.getElementById("taskList").addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;
    const task = tasks.find(item => item.id === id);

    if (!task) return;

    try {
        if (action === "delete") {
            if (!confirm("Ushbu vazifani o'chirmoqchimisiz?")) return;

            await deleteTask(id);
            await loadTasks();
        }

        if (action === "edit") {
            editingTaskId = id;

            document.getElementById("taskTitle").value = task.title;
            document.getElementById("taskDescription").value = task.description;
            document.getElementById("taskPriority").value = task.priority;

            document.getElementById("taskForm").classList.remove("hidden");
            document.getElementById("taskTitle").focus();
        }

    } catch (error) {
        alert(error.message);
    }
});


// Complete task

document.getElementById("taskList").addEventListener("change", async (event) => {
    const checkbox = event.target.closest('input[data-action="complete"]');

    if (!checkbox) return;

    const id = Number(checkbox.dataset.id);

    try {
        await updateTask(id, {
            is_completed: checkbox.checked
        });

        await loadTasks();

    } catch (error) {
        alert(error.message);
        checkbox.checked = !checkbox.checked;
    }
});


// Filters

document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".nav-item").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        const titles = {
            all: "All Tasks",
            today: "Today's Tasks",
            active: "Active Tasks",
            completed: "Completed Tasks"
        };

        document.getElementById("sectionTitle").textContent =
            titles[currentFilter];

        refreshTasks();
    });
});
