// === Data ===
let admins = JSON.parse(localStorage.getItem("admins")) || [{ username: "admin", password: "admin" }];
let customers = JSON.parse(localStorage.getItem("customers")) || [];

// === Login Funktionalitet ===
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

document.getElementById("admin-goto-customers").onclick = () => {
  showOnlyAdminSection("admin-customers");
  renderCustomerList();
};

// === Kundehåndtering ===
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

document.getElementById("add-customer-btn").addEventListener("click", () => {
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
});

document.getElementById("customer-search").addEventListener("input", e => {
  renderCustomerList(e.target.value);
});
