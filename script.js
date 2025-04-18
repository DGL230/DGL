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
  const foundAdmin = admins.find(a => a.username === user && a.password === pass);
  const foundCustomer = customers.find(c => c.username === user && c.password === pass);

  if (foundAdmin) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-section").style.display = "block";
    showOnlyAdminSection("admin-dashboard");
  } else if (foundCustomer) {
    renderCustomerDashboard(foundCustomer);
  } else {
    document.getElementById("login-error").innerText = "Forkert login";
  }
};

function renderCustomerDashboard(customer) {
  document.getElementById("login-section").style.display = "none";
  document.body.innerHTML = `
    <div class='max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow'>
      <h2 class='text-2xl font-bold mb-4 text-green-700 text-center'>Velkommen, ${customer.username}!</h2>
      <div class='mb-4'>
        <label class='block mb-1 font-semibold'>Email:</label>
        <input type='email' id='cust-email' value='${customer.email || ""}' class='border p-2 w-full rounded' />
      </div>
      <div class='mb-4'>
        <label class='block mb-1 font-semibold'>Telefon:</label>
        <input type='tel' id='cust-phone' value='${customer.phone || ""}' class='border p-2 w-full rounded' />
      </div>
      <div class='mb-4'>
        <label class='block mb-1 font-semibold'>Adresse:</label>
        <input type='text' id='cust-address' value='${customer.address || ""}' class='border p-2 w-full rounded' />
      </div>
      <div class='mb-4'>
        <label class='block mb-1 font-semibold'>Ny adgangskode:</label>
        <input type='password' id='cust-password' class='border p-2 w-full rounded' />
      </div>
      <button onclick='saveCustomerInfo("${customer.username}")' class='bg-green-600 text-white px-4 py-2 rounded w-full mb-4'>Gem oplysninger</button>
      <button onclick='location.reload()' class='bg-red-500 text-white px-4 py-2 rounded w-full'>Log ud</button>
    </div>
  `;
}

function saveCustomerInfo(username) {
  const email = document.getElementById("cust-email").value.trim();
  const phone = document.getElementById("cust-phone").value.trim();
  const address = document.getElementById("cust-address").value.trim();
  const password = document.getElementById("cust-password").value.trim();

  const index = customers.findIndex(c => c.username === username);
  if (index !== -1) {
    customers[index].email = email;
    customers[index].phone = phone;
    customers[index].address = address;
    if (password) customers[index].password = password;
    localStorage.setItem("customers", JSON.stringify(customers));
    alert("Dine oplysninger er opdateret");
  }
}

// === OPRET KUNDE (retter name -> username) ===
document.addEventListener("click", function(e) {
  if (e.target && e.target.id === "add-customer-btn") {
    const username = document.getElementById("new-cust-name").value.trim();
    const pass = document.getElementById("new-cust-pass").value.trim();
    const email = document.getElementById("new-cust-email").value.trim();
    const phone = document.getElementById("new-cust-phone").value.trim();
    const address = document.getElementById("new-cust-address").value.trim();

    if (!username || !pass) return alert("Navn og kodeord er påkrævet");

    const newCustomer = { username, password: pass, email, phone, address };
    customers.push(newCustomer);
    localStorage.setItem("customers", JSON.stringify(customers));

    document.getElementById("new-cust-name").value = "";
    document.getElementById("new-cust-pass").value = "";
    document.getElementById("new-cust-email").value = "";
    document.getElementById("new-cust-phone").value = "";
    document.getElementById("new-cust-address").value = "";

    alert("Kunde tilføjet");
  }
});


    alert("Kunde tilføjet");
  };
}
