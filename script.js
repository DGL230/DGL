const adminUser = "admin";
const adminPass = "admin";

let customers = [];
let currentUser = null;
let cart = [];

const products = [
  { category: "Salater", items: ["Ruccola", "Iceberg", "Spinat"] },
  { category: "Krydderurter", items: ["Basilikum", "Timian", "Dild"] },
  { category: "Tomatvarianter", items: ["Cherrytomat", "Blomme", "Bøf"] }
];

const orders = [];

const loginSection = document.getElementById("login-section");
const adminSection = document.getElementById("admin-section");
const customerSection = document.getElementById("customer-section");
const loginBtn = document.getElementById("login-btn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");
const logoutAdminBtn = document.getElementById("logout-admin");
const logoutCustomerBtn = document.getElementById("logout-customer");

const custName = document.getElementById("cust-name");
const custPass = document.getElementById("cust-pass");
const custCVR = document.getElementById("cust-cvr");
const custEmail = document.getElementById("cust-email");
const custPhone = document.getElementById("cust-phone");
const allowSMS = document.getElementById("cust-allow-sms");
const allowMail = document.getElementById("cust-allow-mail");
const deliveryDays = document.querySelectorAll("#delivery-days input");
const saveCustomerBtn = document.getElementById("save-customer");
const customerList = document.getElementById("customer-list");

const welcomeMsg = document.getElementById("welcome-msg");
const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart");
const comment = document.getElementById("comment");
const confirmOrderBtn = document.getElementById("confirm-order");

const popup = document.getElementById("popup");
const popupMsg = document.getElementById("popup-msg");
const popupClose = document.getElementById("popup-close");

function showSection(section) {
  loginSection.style.display = "none";
  adminSection.style.display = "none";
  customerSection.style.display = "none";
  section.style.display = "block";
}

function login() {
  const user = usernameInput.value.trim();
  const pass = passwordInput.value;

  if (user === adminUser && pass === adminPass) {
    currentUser = { type: "admin" };
    showSection(adminSection);
    renderCustomerList();
  } else {
    const cust = customers.find(c => c.name === user && c.password === pass);
    if (cust) {
      currentUser = { type: "customer", data: cust };
      showSection(customerSection);
      welcomeMsg.innerText = `Velkommen, ${cust.name}`;
      renderProducts();
      cart = [];
      renderCart();
      scheduleNotification(cust);
    } else {
      loginError.innerText = "Forkert brugernavn eller kodeord";
    }
  }
}

function logout() {
  currentUser = null;
  usernameInput.value = "";
  passwordInput.value = "";
  loginError.innerText = "";
  showSection(loginSection);
}

function saveCustomer() {
  const name = custName.value.trim();
  const password = custPass.value;
  const cvr = custCVR.value.trim();
  const email = custEmail.value.trim();
  const phone = custPhone.value.trim();
  const sms = allowSMS.checked;
  const mail = allowMail.checked;
  const days = Array.from(deliveryDays)
    .filter(d => d.checked)
    .map(d => parseInt(d.value));

  if (!name || !password) return alert("Udfyld navn og kodeord");

  const existing = customers.find(c => c.name === name);
  if (existing) {
    existing.password = password;
    existing.cvr = cvr;
    existing.email = email;
    existing.phone = phone;
    existing.allowSMS = sms;
    existing.allowMail = mail;
    existing.days = days;
    alert("Kunde opdateret!");
  } else {
    customers.push({ name, password, cvr, email, phone, allowSMS: sms, allowMail: mail, days });
    alert("Kunde oprettet!");
  }

  custName.value = "";
  custPass.value = "";
  custCVR.value = "";
  custEmail.value = "";
  custPhone.value = "";
  allowSMS.checked = false;
  allowMail.checked = false;
  deliveryDays.forEach(d => (d.checked = false));

  renderCustomerList();
}

function renderCustomerList() {
  customerList.innerHTML = "";
  customers.forEach(c => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${c.name}</strong><br/>
      CVR: ${c.cvr || "-"}<br/>
      Email: ${c.email || "-"}<br/>
      Tlf: ${c.phone || "-"}<br/>
      Dage: ${c.days.map(d => ["Søn","Man","Tir","Ons","Tor","Fre","Lør"][d]).join(", ")}<br/>
      ${c.allowSMS ? `<a href="sms:${c.phone}?body=Husk at bestille dine grøntsager til i morgen!">📲 Send SMS</a><br/>` : ""}
      ${c.allowMail ? `<a href="mailto:${c.email}?subject=Påmindelse&body=Husk at bestille dine varer til levering i morgen.">📩 Send Mail</a>` : ""}
    `;
    li.onclick = () => fillCustomerForm(c);
    customerList.appendChild(li);
  });
}

function fillCustomerForm(cust) {
  custName.value = cust.name;
  custPass.value = cust.password;
  custCVR.value = cust.cvr || "";
  custEmail.value = cust.email || "";
  custPhone.value = cust.phone || "";
  allowSMS.checked = cust.allowSMS || false;
  allowMail.checked = cust.allowMail || false;
  deliveryDays.forEach(d => {
    d.checked = cust.days.includes(parseInt(d.value));
  });
}

function renderProducts() {
  productList.innerHTML = "";
  products.forEach(cat => {
    const h3 = document.createElement("h3");
    h3.innerText = cat.category;
    productList.appendChild(h3);
    cat.items.forEach(item => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerText = item;
      const btn = document.createElement("button");
      btn.innerText = "Tilføj";
      btn.onclick = () => addToCart(item);
      div.appendChild(btn);
      productList.appendChild(div);
    });
  });
}

function addToCart(item) {
  const found = cart.find(p => p.name === item);
  if (found) found.qty++;
  else cart.push({ name: item, qty: 1 });
  renderCart();
}

function renderCart() {
  cartList.innerHTML = "";
  cart.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.name} x${p.qty}
      <div class="cart-controls">
        <button onclick="changeQty(${i}, 1)">+</button>
        <button onclick="changeQty(${i}, -1)">–</button>
        <button onclick="removeItem(${i})">❌</button>
      </div>
    `;
    cartList.appendChild(li);
  });
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

function confirmOrder() {
  if (cart.length === 0) return alert("Din kurv er tom");
  orders.push({
    by: currentUser.data.name,
    items: [...cart],
    comment: comment.value,
    date: new Date().toLocaleString()
  });
  showPopup("Tak for din ordre!");
  cart = [];
  comment.value = "";
  renderCart();
}

function showPopup(msg) {
  popupMsg.innerText = msg;
  popup.style.display = "flex";
}

function scheduleNotification(cust) {
  const now = new Date();
  const tomorrow = (now.getDay() + 1) % 7;
  if (!cust.days.includes(tomorrow)) return;

  const todayAt21 = new Date();
  todayAt21.setHours(21, 0, 0, 0);
  const msUntil21 = todayAt21 - now;

  if (msUntil21 <= 0) {
    showPopup("Påmindelse: Du har levering i morgen!");
  } else {
    setTimeout(() => {
      showPopup("Påmindelse: Du har levering i morgen!");
    }, msUntil21);
  }
}

// Events
loginBtn.onclick = login;
logoutAdminBtn.onclick = logout;
logoutCustomerBtn.onclick = logout;
saveCustomerBtn.onclick = saveCustomer;
confirmOrderBtn.onclick = confirmOrder;
popupClose.onclick = () => (popup.style.display = "none");

showSection(loginSection);
