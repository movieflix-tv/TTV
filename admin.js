const USER = "admin";
const PASS = "1234"; // Cambia esto a tu contraseña segura

function login() {
    const user = document.getElementById("adminUser").value;
    const pass = document.getElementById("adminPass").value;

    if(user === USER && pass === PASS) {
        document.getElementById("loginDiv").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";
        loadVideos();
    } else {
        alert("Usuario o contraseña incorrecta");
    }
}

// Simularemos videos.json en memoria (temporal)
let videos = [];

function loadVideos() {
    const list = document.getElementById("videoList");
    list.innerHTML = "";
    videos.forEach((v, i) => {
        const li = document.createElement("li");
        li.textContent = `${v.title} - ${v.category}`;
        list.appendChild(li);
    });
}

function addVideo() {
    const title = document.getElementById("videoTitle").value;
    const category = document.getElementById("videoCategory").value;
    const thumbnail = document.getElementById("videoThumbnail").value;
    const videoLink = document.getElementById("videoLink").value;

    if(title && category && thumbnail && videoLink) {
        videos.push({title, category, thumbnail, video: videoLink});
        loadVideos();
        document.getElementById("videoTitle").value = "";
        document.getElementById("videoCategory").value = "";
        document.getElementById("videoThumbnail").value = "";
        document.getElementById("videoLink").value = "";
    } else {
        alert("Todos los campos son obligatorios");
    }
}
