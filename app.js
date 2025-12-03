// Carga videos y maneja UI
async function fetchJSON(url){ const r = await fetch(url); return r.json(); }


const grid = document.getElementById('grid');
const modal = document.getElementById('playerModal');
const player = document.getElementById('player');
const closeBtn = document.querySelector('.close');
const dropdown = document.querySelector('.dropdown');
const dropbtn = document.getElementById('catBtn');
const dropdownContent = document.getElementById('dropdownContent');
const searchCat = document.getElementById('searchCat');
const globalSearch = document.getElementById('globalSearch');


let videos = [];


function renderGrid(list){
grid.innerHTML = '';
list.forEach(v => {
const el = document.createElement('div'); el.className='card';
el.innerHTML = `
<div class="thumb" style="background-image:url('${v.thumb||"https://via.placeholder.com/320x180?text=No+Thumb"}')"></div>
<div class="meta"><div class="title">${v.title}</div><div class="cat">${v.category}</div><