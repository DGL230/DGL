// === DATA ===
let admins = JSON.parse(localStorage.getItem("admins")) || [{ username: "admin", password: "admin" }];
let customers = JSON.parse(localStorage.getItem("customers")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let contactInfo = JSON.parse(localStorage.getItem("contactInfo")) || {};

// === LOGIN ===
document.getElementById("login-btn").onclick = () => {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const found = admins.find(a => a.username === user && a.password === pass);
  if (found) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-section").style.display = "block";
    showOnlyAdminSection("admin-dashboard");
  } else {
    document.getElementById("login-error").innerText = "Forkert login";
  }
};

document.getElementById("logout-admin").onclick = () => {
  document.getElementById("admin-section").style.display = "none";
  document.getElementById("login-section").style.display = "block";
};

function showOnlyAdminSection(id) {
  ["admin-dashboard", "admin-orders", "admin-customers", "admin-products", "admin-contact-editor", "admin-manage-admins"].forEach(sec => {
    const section = document.getElementById(sec);
    if (section) section.style.display = "none";
  });
  const active = document.getElementById(id);
  if (active) active.style.display = "block";
}

function goToDashboard() {
  showOnlyAdminSection("admin-dashboard");
}

// === NAVIGATION ===
document.getElementById("admin-goto-customers").onclick = () => {
  showOnlyAdminSection("admin-customers");
  renderCustomerList();
};

document.getElementById("admin-goto-products").onclick = () => {
  showOnlyAdminSection("admin-products");
  renderProductList();
};

document.getElementById("admin-goto-orders").onclick = () => {
  showOnlyAdminSection("admin-orders");
  renderOrderList();
};

document.getElementById("admin-goto-contact").onclick = () => {
  showOnlyAdminSection("admin-contact-editor");
  loadContactEditor();
};

document.getElementById("admin-goto-admins").onclick = () => {
  showOnlyAdminSection("admin-manage-admins");
  renderAdminList();
};

// === KUNDER ===
function renderCustomerList(filter = "") {
  const container = document.getElementById("customer-list");
  container.innerHTML = "";
  const filtered = customers.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));

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

document.getElementById("add-customer-btn").onclick = () => {
  const name = document.getElementById("new-cust-name").value.trim();
  const pass = document.getElementById("new-cust-pass").value.trim();
  const email = document.getElementById("new-cust-email").value.trim();
  const phone = document.getElementById("new-cust-phone").value.trim();
  const address = document.getElementById("new-cust-address").value.trim();

  if (!name || !pass) return alert("Navn og kodeord er påkrævet");

  const newCustomer = { name, password: pass, email, phone, address };
  customers.push(newCustomer);
  localStorage.setItem("customers", JSON.stringify(customers));

  document.getElementById("new-cust-name").value = "";
  document.getElementById("new-cust-pass").value = "";
  document.getElementById("new-cust-email").value = "";
  document.getElementById("new-cust-phone").value = "";
  document.getElementById("new-cust-address").value = "";

  alert("Kunde tilføjet");
  renderCustomerList();
};

document.getElementById("customer-search").addEventListener("input", e => {
  renderCustomerList(e.target.value);
});

// === PRODUKTER ===
function renderProductList() {
  const ul = document.getElementById("product-list");
  ul.innerHTML = "";
  products.forEach((product, index) => {
    const li = document.createElement("li");
    li.className = "bg-white p-2 rounded shadow flex justify-between items-center";
    li.innerHTML = `
      <span>${product}</span>
      <button class="bg-red-600 text-white px-2 py-1 rounded" onclick="deleteProduct(${index})">Slet</button>
    `;
    ul.appendChild(li);
  });
}

function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  renderProductList();
}

document.getElementById("add-product-btn").onclick = () => {
  const name = document.getElementById("product-name").value.trim();
  if (!name) return alert("Indtast et produktnavn");
  products.push(name);
  localStorage.setItem("products", JSON.stringify(products));
  document.getElementById("product-name").value = "";
  renderProductList();
};

// === ORDRER ===
function renderOrderList() {
  const list = document.getElementById("order-list");
  list.innerHTML = "";
  if (!orders.length) {
    list.innerHTML = "<p class='text-center text-gray-500'>Ingen ordrer endnu</p>";
    return;
  }
  orders.forEach(order => {
    const div = document.createElement("div");
    div.className = "bg-white p-4 shadow rounded border";
    div.innerHTML = `
      <p><strong>Kunde:</strong> ${order.kunde}</p>
      <p><strong>Dato:</strong> ${order.dato}</p>
      <p><strong>Produkter:</strong> ${order.produkter.join(", ")}</p>
      <p><strong>Status:</strong> ${order.status}</p>
    `;
    list.appendChild(div);
  });
}

// === KONTAKTINFO ===
function loadContactEditor() {
  document.getElementById("contact-name").value = contactInfo.name || "";
  document.getElementById("contact-email").value = contactInfo.email || "";
  document.getElementById("contact-phone").value = contactInfo.phone || "";
  document.getElementById("contact-address").value = contactInfo.address || "";
}

document.getElementById("save-contact").onclick = () => {
  contactInfo = {
    name: document.getElementById("contact-name").value.trim(),
    email: document.getElementById("contact-email").value.trim(),
    phone: document.getElementById("contact-phone").value.trim(),
    address: document.getElementById("contact-address").value.trim()
  };
  localStorage.setItem("contactInfo", JSON.stringify(contactInfo));
  alert("Kontaktinfo gemt");
};

// === ADMINS ===
function renderAdminList() {
  const ul = document.getElementById("admin-list");
  ul.innerHTML = "";
  admins.forEach((admin, index) => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-white p-2 rounded shadow";
    li.innerHTML = `
      <span>${admin.username}</span>
      ${admin.username !== "admin" ? `<button class='bg-red-600 text-white px-2 py-1 rounded' onclick='deleteAdmin(${index})'>Slet</button>` : ""}
    `;
    ul.appendChild(li);
  });
}

document.getElementById("add-admin-btn").onclick = () => {
  const username = document.getElementById("new-admin-username").value.trim();
  const password = document.getElementById("new-admin-password").value.trim();
  if (!username || !password) return alert("Udfyld begge felter");
  admins.push({ username, password });
  localStorage.setItem("admins", JSON.stringify(admins));
  renderAdminList();
  document.getElementById("new-admin-username").value = "";
  document.getElementById("new-admin-password").value = "";
};

function deleteAdmin(index) {
  admins.splice(index, 1);
  localStorage.setItem("admins", JSON.stringify(admins));
  renderAdminList();
}
