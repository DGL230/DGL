// ======= Lagring =======
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function loadFromStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// ======= Data =======
let customers = loadFromStorage("customers");
let products = loadFromStorage("products");
let orders = loadFromStorage("orders");
let currentUser = null;
let cart = [];

// ======= DOM =======
const loginBtn = document.getElementById("login-btn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");

const adminSection = document.getElementById("admin-section");
const customerSection = document.getElementById("customer-section");
const loginSection = document.getElementById("login-section");
const logoutAdminBtn = document.getElementById("logout-admin");
const logoutCustomerBtn = document.getElementById("logout-customer");

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.onclick = () => {
  navMenu.classList.toggle("show");
};
// ========== ADMIN: Kunde-editor ==========
const custName = document.getElementById("cust-name");
const custPass = document.getElementById("cust-pass");
const custAddress = document.getElementById("cust-address");
const custCVR = document.getElementById("cust-cvr");
const custEmail = document.getElementById("cust-email");
const custPhone = document.getElementById("cust-phone");
const allowSMS = document.getElementById("cust-allow-sms");
const allowMail = document.getElementById("cust-allow-mail");
const deliveryDays = document.querySelectorAll("#delivery-days input");
const saveCustomerBtn = document.getElementById("save-customer");
const customerList = document.getElementById("customer-list");

saveCustomerBtn.onclick = () => {
  const name = custName.value.trim();
  const password = custPass.value.trim();
  const address = custAddress.value.trim();
  const cvr = custCVR.value.trim();
  const email = custEmail.value.trim();
  const phone = custPhone.value.trim();
  const sms = allowSMS.checked;
  const mail = allowMail.checked;
  const days = Array.from(deliveryDays).filter(d => d.checked).map(d => parseInt(d.value));

  if (!name || !password) return alert("Udfyld navn og kode");

  const existing = customers.find(c => c.name === name);
  if (existing) {
    Object.assign(existing, { password, address, cvr, email, phone, allowSMS: sms, allowMail: mail, days });
  } else {
    customers.push({ name, password, address, cvr, email, phone, allowSMS: sms, allowMail: mail, days });
  }

  saveToStorage("customers", customers);
  renderCustomerList();
  alert("Kunde gemt");
};

function renderCustomerList() {
  customerList.innerHTML = "";
  customers.forEach(c => {
    const li = document.createElement("li");
    li.innerHTML = `
      <b>${c.name}</b> – ${c.phone || "Tlf?"} <br/>
      Adresse: ${c.address || "-"}<br/>
      Levering: ${c.days.map(d => ["Søn","Man","Tir","Ons","Tor","Fre","Lør"][d]).join(", ")}<br/>
      ${c.allowSMS ? `<a href="sms:${c.phone}?body=Husk at bestille!">📲</a>` : ""}
      ${c.allowMail ? `<a href="mailto:${c.email}?subject=Bestilling&body=Husk at bestille!">📩</a>` : ""}
    `;
    li.onclick = () => {
      custName.value = c.name;
      custPass.value = c.password;
      custAddress.value = c.address || "";
      custCVR.value = c.cvr || "";
      custEmail.value = c.email || "";
      custPhone.value = c.phone || "";
      allowSMS.checked = !!c.allowSMS;
      allowMail.checked = !!c.allowMail;
      deliveryDays.forEach(d => d.checked = c.days.includes(parseInt(d.value)));
    };
    customerList.appendChild(li);
  });
}

// ========== ADMIN: Produkteditor ==========
const productName = document.getElementById("product-name");
const productCategory = document.getElementById("product-category");
const productImage = document.getElementById("product-image");
const addProductBtn = document.getElementById("add-product");
const productAdminList = document.getElementById("product-admin-list");

addProductBtn.onclick = () => {
  const name = productName.value.trim();
  const category = productCategory.value.trim();
  const file = productImage.files[0];

  if (!name || !category || !file) return alert("Udfyld alle felter og vælg billede");

  const reader = new FileReader();
  reader.onload = function (e) {
    products.push({ name, category, img: e.target.result });
    saveToStorage("products", products);
    renderProductAdmin();
    alert("Produkt tilføjet!");
    productName.value = "";
    productCategory.value = "";
    productImage.value = "";
  };
  reader.readAsDataURL(file);
};

function renderProductAdmin() {
  productAdminList.innerHTML = "";
  products.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${p.img}" style="max-width: 80px" /><br/>
      <b>${p.name}</b> – ${p.category}
    `;
    productAdminList.appendChild(li);
  });
}
// ========== Kunde: vis produkter ==========
const productList = document.getElementById("product-list");

function renderProducts() {
  productList.innerHTML = "";
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    const header = document.createElement("h4");
    header.innerText = cat;
    productList.appendChild(header);

    products.filter(p => p.category === cat).forEach(p => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <img src="${p.img}" alt="${p.name}" />
        <strong>${p.name}</strong><br/>
        <button onclick="addToCart('${p.name}')">Tilføj</button>
      `;
      productList.appendChild(div);
    });
  });
}

// ========== Kurv ==========
const cartList = document.getElementById("cart");
const comment = document.getElementById("comment");
const confirmOrderBtn = document.getElementById("confirm-order");

function addToCart(name) {
  const found = cart.find(p => p.name === name);
  if (found) found.qty++;
  else cart.push({ name, qty: 1 });
  renderCart();
}

function renderCart() {
  cartList.innerHTML = "";
  cart.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x${item.qty}
      <div class="cart-controls">
        <button onclick="updateQty(${i}, 1)">+</button>
        <button onclick="updateQty(${i}, -1)">–</button>
        <button onclick="removeFromCart(${i})">❌</button>
      </div>
    `;
    cartList.appendChild(li);
  });
}

function updateQty(index, change) {
  cart[index].qty += change;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

confirmOrderBtn.onclick = () => {
  if (cart.length === 0) return alert("Kurven er tom");
  orders.push({
    by: currentUser.name,
    items: cart,
    comment: comment.value,
    date: new Date().toLocaleString()
  });
  saveToStorage("orders", orders);
  cart = [];
  comment.value = "";
  renderCart();
  showPopup("Tak for din ordre!");
};

// ========== Kunde: profil ==========
const myName = document.getElementById("my-name");
const myPass = document.getElementById("my-pass");
const myAddress = document.getElementById("my-address");
const myEmail = document.getElementById("my-email");
const myPhone = document.getElementById("my-phone");
const saveProfileBtn = document.getElementById("save-my-profile");

saveProfileBtn.onclick = () => {
  const me = customers.find(c => c.name === currentUser.name);
  if (!me) return;

  if (myPass.value.trim()) me.password = myPass.value.trim();
  me.address = myAddress.value.trim();
  me.email = myEmail.value.trim();
  me.phone = myPhone.value.trim();

  saveToStorage("customers", customers);
  showPopup("Profil opdateret!");
};

function loadProfile() {
  const me = customers.find(c => c.name === currentUser.name);
  if (!me) return;
  myName.value = me.name;
  myAddress.value = me.address || "";
  myEmail.value = me.email || "";
  myPhone.value = me.phone || "";
  myPass.value = "";
}
// ========== Menu navigation ==========
document.getElementById("nav-products").onclick = () => switchCustomerView("products");
document.getElementById("nav-cart").onclick = () => switchCustomerView("cart");
document.getElementById("nav-profile").onclick = () => {
  switchCustomerView("profile");
  loadProfile();
};

function switchCustomerView(view) {
  document.querySelectorAll(".page-section").forEach(s => s.style.display = "none");
  if (view === "products") document.getElementById("customer-products").style.display = "block";
  if (view === "cart") document.getElementById("customer-cart").style.display = "block";
  if (view === "profile") document.getElementById("customer-profile").style.display = "block";
  navMenu.classList.remove("show");
}

// ========== Login/logout ==========
loginBtn.onclick = () => {
  const user = usernameInput.value.trim();
  const pass = passwordInput.value.trim();
  loginError.innerText = "";

  if (user === "admin" && pass === "admin") {
    currentUser = { name: "admin", type: "admin" };
    showSection("admin");
    renderCustomerList();
    renderProductAdmin();
    return;
  }

  const found = customers.find(c => c.name === user && c.password === pass);
  if (found) {
    currentUser = { ...found, type: "customer" };
    showSection("customer");
    document.getElementById("welcome-msg").innerText = `Velkommen, ${found.name}`;
    renderProducts();
    renderCart();
    switchCustomerView("products");
    checkNotification(found);
    return;
  }

  loginError.innerText = "Forkert brugernavn eller kodeord";
};

logoutAdminBtn.onclick = logoutCustomerBtn.onclick = () => {
  currentUser = null;
  cart = [];
  showSection("login");
};

function showSection(id) {
  loginSection.style.display = "none";
  adminSection.style.display = "none";
  customerSection.style.display = "none";

  if (id === "admin") adminSection.style.display = "block";
  if (id === "customer") customerSection.style.display = "block";
  if (id === "login") loginSection.style.display = "block";
}

// ========== Påmindelse om levering ==========
function checkNotification(user) {
  const now = new Date();
  const tomorrow = (now.getDay() + 1) % 7;
  if (!user.days || !user.days.includes(tomorrow)) return;

  const tonight = new Date();
  tonight.setHours(21, 0, 0, 0);

  const diff = tonight - now;
  if (diff <= 0) {
    showPopup("Påmindelse: Du har levering i morgen!");
  } else {
    setTimeout(() => {
      showPopup("Påmindelse: Du har levering i morgen!");
    }, diff);
  }
}

// ========== Popup ==========
const popup = document.getElementById("popup");
const popupMsg = document.getElementById("popup-msg");
const popupClose = document.getElementById("popup-close");

function showPopup(msg) {
  popupMsg.innerText = msg;
  popup.style.display = "flex";
}

popupClose.onclick = () => popup.style.display = "none";

// ========== Init ==========
showSection("login");
renderCustomerList();
renderProductAdmin();
// ====== Kontakt Info System ======
const contactName = document.getElementById("contact-name");
const contactEmail = document.getElementById("contact-email");
const contactPhone = document.getElementById("contact-phone");
const contactAddress = document.getElementById("contact-address");
const saveContactBtn = document.getElementById("save-contact");
const contactView = document.getElementById("contact-view");

// Gem kontaktinfo
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

// Indlæs i admin
function loadContactEditor() {
  const info = JSON.parse(localStorage.getItem("contactInfo")) || {};
  contactName.value = info.name || "";
  contactEmail.value = info.email || "";
  contactPhone.value = info.phone || "";
  contactAddress.value = info.address || "";
}

// Vis til kunde
function renderContactView() {
  const info = JSON.parse(localStorage.getItem("contactInfo")) || {};
  contactView.innerHTML = `
    <p><strong>${info.name || "Firmanavn ikke angivet"}</strong></p>
    <p>📞 <a href="tel:${info.phone || ''}">${info.phone || "Telefon ikke angivet"}</a></p>
    <p>📩 <a href="mailto:${info.email || ''}">${info.email || "Email ikke angivet"}</a></p>
    ${info.address ? `<p>📍 ${info.address}</p>` : ""}
  `;
}

// Navigationsknapper
document.getElementById("admin-goto-contact").onclick = () => {
  showOnlyAdminSection("admin-contact-editor");
  loadContactEditor();
};

document.getElementById("nav-contact").onclick = () => {
  renderContactView();
  showSection("contact");
};

// Helper
function showOnlyAdminSection(id) {
  ["admin-dashboard", "admin-customers", "admin-products", "admin-orders", "admin-contact-editor"]
    .forEach(sec => document.getElementById(sec).style.display = "none");
  document.getElementById(id).style.display = "block";
}
