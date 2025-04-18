// === Data ===
let admins = JSON.parse(localStorage.getItem("admins")) || [{ username: "admin", password: "admin" }];
let customers = JSON.parse(localStorage.getItem("customers")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let contactInfo = JSON.parse(localStorage.getItem("contactInfo")) || {};

// === DOM ===
const loginBtn = document.getElementById("login-btn");
const logoutAdminBtn = document.getElementById("logout-admin");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");

// === Login ===
loginBtn.onclick = () => {
  const user = usernameInput.value.trim();
  const pass = passwordInput.value.trim();
  const found = admins.find(a => a.username === user && a.password === pass);
  if (found) {
    showSection("admin");
    showOnlyAdminSection("admin-dashboard");
  } else {
    loginError.innerText = "Forkert login";
  }
};

logoutAdminBtn.onclick = () => {
  showSection("login");
};

function showSection(id) {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("admin-section").style.display = "none";

  if (id === "login") document.getElementById("login-section").style.display = "block";
  if (id === "admin") document.getElementById("admin-section").style.display = "block";
}

function showOnlyAdminSection(id) {
  ["admin-dashboard", "admin-orders", "admin-customers", "admin-products", "admin-contact-editor", "admin-manage-admins"]
    .forEach(sec => {
      const section = document.getElementById(sec);
      if (section) section.style.display = "none";
    });
  const active = document.getElementById(id);
  if (active) active.style.display = "block";
}

function goToDashboard() {
  showOnlyAdminSection("admin-dashboard");
}

// === Navigationsknapper ===
document.getElementById("admin-goto-orders").onclick = () => {
  showOnlyAdminSection("admin-orders");
  renderOrderList();
};

document.getElementById("admin-goto-customers").onclick = () => {
  showOnlyAdminSection("admin-customers");
  renderCustomerList();
};

document.getElementById("admin-goto-products").onclick = () => {
  showOnlyAdminSection("admin-products");
  renderProductAdmin();
};

document.getElementById("admin-goto-contact").onclick = () => {
  showOnlyAdminSection("admin-contact-editor");
  loadContactEditor();
};

document.getElementById("admin-goto-admins").onclick = () => {
  showOnlyAdminSection("admin-manage-admins");
  renderAdminList();
};

// === Kontaktinfo ===
const contactName = document.getElementById("contact-name");
const contactEmail = document.getElementById("contact-email");
const contactPhone = document.getElementById("contact-phone");
const contactAddress = document.getElementById("contact-address");
const saveContactBtn = document.getElementById("save-contact");

saveContactBtn.onclick = () => {
  const info = {
    name: contactName.value.trim(),
    email: contactEmail.value.trim(),
    phone: contactPhone.value.trim(),
    address: contactAddress.value.trim()
  };
  localStorage.setItem("contactInfo", JSON.stringify(info));
  alert("Kontaktinfo gemt!");
  goToDashboard();
};

function loadContactEditor() {
  const info = JSON.parse(localStorage.getItem("contactInfo")) || {};
  contactName.value = info.name || "";
  contactEmail.value = info.email || "";
  contactPhone.value = info.phone || "";
  contactAddress.value = info.address || "";
}

// === Admin Management ===
function renderAdminList() {
  const list = document.getElementById("admin-list");
  list.innerHTML = "";
  admins.forEach((admin, index) => {
    const li = document.createElement("li");
    li.textContent = admin.username;
    if (admin.username !== "admin") {
      const btn = document.createElement("button");
      btn.textContent = "Slet";
      btn.onclick = () => {
        admins.splice(index, 1);
        localStorage.setItem("admins", JSON.stringify(admins));
        renderAdminList();
      };
      li.appendChild(btn);
    }
    list.appendChild(li);
  });
}

document.getElementById("add-admin-btn").onclick = () => {
  const user = document.getElementById("new-admin-username").value.trim();
  const pass = document.getElementById("new-admin-password").value.trim();
  if (!user || !pass) return alert("Udfyld begge felter");
  admins.push({ username: user, password: pass });
  localStorage.setItem("admins", JSON.stringify(admins));
  renderAdminList();
  document.getElementById("new-admin-username").value = "";
  document.getElementById("new-admin-password").value = "";
};

// === Placeholder funktioner ===
function renderOrderList() {
  document.getElementById("order-list").innerText = "(Ordrevisning her – klar til udvidelse)";
}

function renderCustomerList() {
  document.getElementById("customer-list").innerText = "(Kundeliste her – klar til udvidelse)";
}

function renderProductAdmin() {
  document.getElementById("product-admin-list").innerText = "(Produktliste her – klar til udvidelse)";
}

// === Init ===
showSection("login");
// === Ordrer med status ===
function renderOrderList() {
  const list = document.getElementById("order-list");
  list.innerHTML = "";

  if (!orders.length) {
    list.innerHTML = "<p class='text-center text-gray-500'>Ingen ordrer endnu</p>";
    return;
  }

  const sorted = [...orders].sort((a, b) => new Date(b.dato) - new Date(a.dato));

  sorted.forEach((order, index) => {
    const card = document.createElement("div");
    card.className = "bg-white shadow p-4 mb-4 rounded border";
    card.innerHTML = `
      <h4 class="text-lg font-bold text-green-700">${order.kunde}</h4>
      <p><strong>Dato:</strong> ${order.dato}</p>
      <p><strong>Status:</strong> 
        <select class="order-status border p-1 rounded">
          <option value="Modtaget" ${order.status === "Modtaget" ? "selected" : ""}>Modtaget</option>
          <option value="Behandles" ${order.status === "Behandles" ? "selected" : ""}>Behandles</option>
          <option value="Leveret" ${order.status === "Leveret" ? "selected" : ""}>Leveret</option>
        </select>
      </p>
      <p><strong>Produkter:</strong> ${order.produkter?.join(", ") || "-"}</p>
      ${order.kommentar ? `<p><strong>Kommentar:</strong> ${order.kommentar}</p>` : ""}
    `;

    card.querySelector(".order-status").onchange = (e) => {
      order.status = e.target.value;
      localStorage.setItem("orders", JSON.stringify(orders));
      alert("Status opdateret");
    };

    list.appendChild(card);
  });
}
