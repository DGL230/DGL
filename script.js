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

// === Navigation ===
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
      btn.className = "ml-2 bg-red-500 text-white px-2 py-1 rounded";
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

// === Kunderedigering ===
function renderCustomerList(filter = "") {
  const container = document.getElementById("customer-list");
  container.innerHTML = "";

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    container.innerHTML = "<p class='text-center text-gray-500'>Ingen kunder fundet</p>";
    return;
  }

  filtered.forEach((cust, index) => {
    const div = document.createElement("div");
    div.className = "bg-white shadow p-4 rounded border";
    div.innerHTML = `
      <input type="text" value="${cust.name}" class="cust-name border p-1 rounded w-full mb-2" />
      <input type="text" value="${cust.address || ''}" class="cust-address border p-1 rounded w-full mb-2" />
      <input type="email" value="${cust.email || ''}" class="cust-email border p-1 rounded w-full mb-2" />
      <input type="tel" value="${cust.phone || ''}" class="cust-phone border p-1 rounded w-full mb-2" />
      <input type="password" placeholder="Skift kodeord" class="cust-pass border p-1 rounded w-full mb-2" />
      <div class="flex gap-2 mt-2">
        <button class="save-btn bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">Gem</button>
        <button class="delete-btn bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Slet</button>
      </div>
    `;

    div.querySelector(".save-btn").onclick = () => {
      cust.name = div.querySelector(".cust-name").value.trim();
      cust.address = div.querySelector(".cust-address").value.trim();
      cust.email = div.querySelector(".cust-email").value.trim();
      cust.phone = div.querySelector(".cust-phone").value.trim();
      const newPass = div.querySelector(".cust-pass").value.trim();
      if (newPass) cust.password = newPass;
      localStorage.setItem("customers", JSON.stringify(customers));
      alert("Kunde opdateret");
    };

    div.querySelector(".delete-btn").onclick = () => {
      if (confirm("Er du sikker på at du vil slette denne kunde?")) {
        customers.splice(index, 1);
        localStorage.setItem("customers", JSON.stringify(customers));
        renderCustomerList();
      }
    };

    container.appendChild(div);
  });
}

document.getElementById("customer-search").addEventListener("input", e => {
  renderCustomerList(e.target.value);
});

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

// === Init ===
showSection("login");
