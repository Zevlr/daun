// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Konfigurasi
const firebaseConfig = {
    apiKey: "AIzaSyA0FuAtnvlHdeRwEV6Eu7-qx4b75XFC_Sw",
    authDomain: "daun-ngomong.firebaseapp.com",
    databaseURL: "https://daun-ngomong-default-rtdb.firebaseio.com",
    projectId: "daun-ngomong",
    storageBucket: "daun-ngomong.firebasestorage.app",
    messagingSenderId: "852808628272",
    appId: "1:852808628272:web:5e5a62887b1435ed62d5f5",
    measurementId: "G-PSMZK2XVQL"
  };


// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Ambil elemen
const els = {
  msgs: document.getElementById("msgs"),
  text: document.getElementById("text"),
  send: document.getElementById("send"),
  nick: document.getElementById("nick"),
};

// default nickname
els.nick.value = localStorage.getItem("nick") || `Anon-${Math.random().toString(36).slice(2,6)}`;

// referensi room "general"
const msgsRef = ref(db, "rooms/general/messages");

// tampilkan pesan baru
onChildAdded(msgsRef, snap => {
  const m = snap.val();
  const div = document.createElement("div");
  div.className = "msg";
  div.innerHTML = `<b>${m.nick}</b>: ${m.text} <span class="meta">(${new Date(m.time).toLocaleTimeString()})</span>`;
  els.msgs.appendChild(div);
  els.msgs.scrollTop = els.msgs.scrollHeight;
});

// kirim pesan
els.send.onclick = async () => {
  const text = els.text.value.trim();
  if (!text) return;
  els.text.value = "";
  localStorage.setItem("nick", els.nick.value);
  await push(msgsRef, {
    nick: els.nick.value,
    text,
    time: Date.now()
  });
};

// enter send
els.text.addEventListener("keydown", e => {
  if (e.key === "Enter") els.send.click();
});
