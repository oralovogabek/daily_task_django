
document.addEventListener("DOMContentLoaded", () => {
    updateDate();
    loadTasks();

    const themeButton = document.getElementById("themeToggle");

    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
});
