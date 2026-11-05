
// =====================================
// DAILYTASK - API CONFIGURATION
// =====================================

const API_URL = "/api/tasks/";

// CSRF token olish
function getCSRFToken() {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
        const item = cookie.trim();

        if (item.startsWith("csrftoken=")) {
            return decodeURIComponent(item.substring("csrftoken=".length));
        }
    }

    return "";
}


// Umumiy API request
async function apiRequest(url, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    const csrfToken = getCSRFToken();

    if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    const text = await response.text();

    let result = null;

    try {
        result = text ? JSON.parse(text) : null;
    } catch {
        result = text;
    }

    if (!response.ok) {
        console.error("API ERROR:", {
            status: response.status,
            response: result
        });

        let message;

        if (typeof result === "string") {
            message = result;
        } else if (result?.detail) {
            message = result.detail;
        } else if (result) {
            message = JSON.stringify(result);
        } else {
            message = "Serverdan javob kelmadi.";
        }

        throw new Error(
            `HTTP ${response.status}: ${message}`
        );
    }

    return result;
}


// Barcha vazifalarni olish
async function getTasks() {
    const result = await apiRequest(API_URL);

    // DRF pagination qo'llanilgan bo'lsa
    return Array.isArray(result) ? result : result.results || [];
}


// Yangi vazifa yaratish
async function createTask(data) {
    return await apiRequest(API_URL, {
        method: "POST",
        body: JSON.stringify(data)
    });
}


// Vazifani yangilash
async function updateTask(id, data) {
    return await apiRequest(`${API_URL}${id}/`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
}


// Vazifani o'chirish
async function deleteTask(id) {
    return await apiRequest(`${API_URL}${id}/`, {
        method: "DELETE"
    });
}
