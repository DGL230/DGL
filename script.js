// Helt komplet script.js med alle funktioner

document.addEventListener("DOMContentLoaded", () => {
  // === DATA ===
  let admins = JSON.parse(localStorage.getItem("admins")) || [{ username: "admin", password: "admin" }];
  let customers = JSON.parse(localStorage.getItem("customers")) || [];
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let contactInfo = JSON.parse(localStorage.getItem("contactInfo")) || {};

  // === ELEMENT REFERENCES ===
  const loginSection = document.getElementById("login-section");
  const adminSection = document.getElementById("admin-section");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-admin");
  const loginError = document.getElementById("login-error");

  // === LOGIN handling ===
  loginBtn.addEventListener("click", () => {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();
    const admin = admins.find(a => a.username === user && a.password === pass);
    const customer = customers.find(c => c.username === user && c.password === pass);

    if (admin) {
      showSection("admin");
      showOnlyAdminSection("admin-dashboard");
    } else if (customer) {
      showCustomerDashboard(customer);
    } else {
      loginError.innerText = "Forkert login";
    }
  });

  // === LOGOUT for admin ===
  logoutBtn.addEventListener("click", () => {
    showSection("login");
  });

  // === SECTION CONTROLS ===
  function showSection(name) {
    loginSection.style.display = "none";
    adminSection.style.display = "none";
    if (name === "login") loginSection.style.display = "block";
    if (name === "admin") adminSection.style.display = "block";
  }

  function showOnlyAdminSection(id) {
    ["admin-dashboard", "admin-customers", "admin-products", "admin-orders", "admin-contact-editor", "admin-manage-admins"].forEach(sec => {
      const el = document.getElementById(sec);
      if (el) el.style.display = "none";
    });
    document.getElementById(id).style.display = "block";
  }

  // Initial view
  showSection("login");

  // === ADMIN NAVIGATION ===
  document.getElementById("admin-goto-customers").onclick = () => { showOnlyAdminSection("admin-customers"); renderCustomerList(); };
  document.getElementById("admin-goto-products").onclick = () => { showOnlyAdminSection("admin-products"); renderProductList(); };
  document.getElementById("admin-goto-orders").onclick = () => { showOnlyAdminSection("admin-orders"); renderOrderList(); };
  document.getElementById("admin-goto-contact").onclick = () => { showOnlyAdminSection("admin-contact-editor"); loadContactInfo(); };
  document.getElementById("admin-goto-admins").onclick = () => { showOnlyAdminSection("admin-manage-admins"); renderAdminList(); };

  // === CUSTOMER DASHBOARD ===
  function showCustomerDashboard(customer) {
    loginSection.style.display = "none";
    document.body.innerHTML = `
      <div class='max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow'>
        <h2 class='text-2xl font-bold mb-4 text-green-700'>Velkommen, ${customer.username}!</h2>
        <label class='block font-semibold'>Email:</label>
        <input id='cust-email' value='${customer.email||""}' class='border p-2 w-full rounded mb-4' />
        <label class='block font-semibold'>Telefon:</label>
        <input id='cust-phone' value='${customer.phone||""}' class='border p-2 w-full rounded mb-4' />
        <label class='block font-semibold'>Adresse:</label>
        <input id='cust-address' value='${customer.address||""}' class='border p-2 w-full rounded mb-4' />
        <label class='block font-semibold'>Ny adgangskode:</label>
        <input type='password' id='cust-password' class='border p-2 w-full rounded mb-4' />
        <button id='save-cust-btn' class='bg-green-600 text-white px-4 py-2 rounded w-full mb-4'>Gem</button>
        <button id='logout-cust-btn' class='bg-red-500 text-white px-4 py-2 rounded w-full'>Log ud</button>
      </div>
    `;
    document.getElementById("logout-cust-btn").onclick = () => location.reload();
    document.getElementById("save-cust-btn").onclick = () => saveCustomerInfo(customer.username);
  }

  function saveCustomerInfo(username) {
    const idx = customers.findIndex(c=>c.username===username);
    if (idx<0) return;
    customers[idx].email = document.getElementById("cust-email").value.trim();
    customers[idx].phone = document.getElementById("cust-phone").value.trim();
    customers[idx].address = document.getElementById("cust-address").value.trim();
    const pw = document.getElementById("cust-password").value.trim();
    if (pw) customers[idx].password = pw;
    localStorage.setItem("customers", JSON.stringify(customers));
    alert("Oplysninger gemt");
  }

  // === CUSTOMER MANAGEMENT (Admin) ===
  function renderCustomerList(filter="") {
    const cList = document.getElementById("customer-list"); cList.innerHTML = "";
    const filtered = customers.filter(c=>c.username.toLowerCase().includes(filter.toLowerCase()));
    if(!filtered.length) { cList.innerHTML="<p>Ingen kunder</p>"; return; }
    filtered.forEach((c,i)=>{
      const row = document.createElement("div"); row.className="bg-white p-4 rounded shadow mb-2";
      row.innerHTML = `
        <input value='${c.username}' class='w-full mb-1 p-1 border rounded username'/>
        <input value='${c.email||""}' class='w-full mb-1 p-1 border rounded email'/>
        <input value='${c.phone||""}' class='w-full mb-1 p-1 border rounded phone'/>
        <input value='${c.address||""}' class='w-full mb-1 p-1 border rounded address'/>
        <input placeholder='Ny kodeord' type='password' class='w-full mb-1 p-1 border rounded newpass'/>
        <button class='save-cust bg-green-600 text-white px-3 py-1 rounded mr-2'>Gem</button>
        <button class='del-cust bg-red-600 text-white px-3 py-1 rounded'>Slet</button>
      `;
      row.querySelector('.save-cust').onclick = ()=>{
        customers[i].email=row.querySelector('.email').value;
        customers[i].phone=row.querySelector('.phone').value;
        customers[i].address=row.querySelector('.address').value;
        const np=row.querySelector('.newpass').value;
        if(np) customers[i].password=np;
        localStorage.setItem('customers',JSON.stringify(customers));
        alert('Kunde gemt');
      };
      row.querySelector('.del-cust').onclick = ()=>{
        if(confirm('Slet kunde?')){
          customers.splice(i,1);
          localStorage.setItem('customers',JSON.stringify(customers)); renderCustomerList();
        }
      };
      cList.appendChild(row);
    });
    document.getElementById("customer-search").oninput=e=>renderCustomerList(e.target.value);
  }
  document.getElementById("add-customer-btn").addEventListener('click', ()=>{
    const u=document.getElementById('new-cust-name').value.trim(); const p=document.getElementById('new-cust-pass').value.trim();
    if(!u||!p) return alert('brugernavn og kodeord kræves');
    customers.push({username:u,password:p,email:'',phone:'',address:''});
    localStorage.setItem('customers',JSON.stringify(customers)); document.getElementById('new-cust-name').value=''; document.getElementById('new-cust-pass').value=''; renderCustomerList();
  });

  // === PRODUCT MANAGEMENT ===
  function renderProductList() {
    const ul=document.getElementById('product-list'); ul.innerHTML='';
    products.forEach((pr,i)=>{
      const li=document.createElement('li'); li.className='bg-white p-2 rounded shadow mb-2 flex justify-between';
      li.innerHTML=`<span>${pr}</span><button class='px-2 bg-red-600 text-white rounded' onclick='deleteProduct(${i})'>Slet</button>`;
      ul.appendChild(li);
    });
  }
  window.deleteProduct=i=>{ products.splice(i,1); localStorage.setItem('products',JSON.stringify(products)); renderProductList(); };
  document.getElementById('add-product-btn').onclick=()=>{
    const n=document.getElementById('product-name').value.trim(); if(!n) return alert('skriv navn');
    products.push(n); localStorage.setItem('products',JSON.stringify(products)); document.getElementById('product-name').value=''; renderProductList();
  };

  // === ORDER MANAGEMENT ===
  function renderOrderList() {
    const dl=document.getElementById('order-list'); dl.innerHTML=''; if(!orders.length) return dl.innerHTML="<p>Ingen ordrer</p>";
    orders.sort((a,b)=>new Date(b.dato)-new Date(a.dato)).forEach(o=>{
      const d=document.createElement('div'); d.className='bg-white p-4 rounded shadow mb-2';
      d.innerHTML=`<p><strong>Kunde:</strong>${o.kunde}</p><p><strong>Dato:</strong>${o.dato}</p><p><strong>Status:</strong> ${o.status}</p><p><strong>Produkter:</strong>${o.produkter.join(',')}</p>`;
      dl.appendChild(d);
    });
  }

  // === CONTACT INFO ===
  function loadContactInfo() {
    document.getElementById('contact-name').value=contactInfo.name||'';
    document.getElementById('contact-email').value=contactInfo.email||'';
    document.getElementById('contact-phone').value=contactInfo.phone||'';
    document.getElementById('contact-address').value=contactInfo.address||'';
  }
  document.getElementById('save-contact').onclick=()=>{
    contactInfo={ name:document.getElementById('contact-name').value, email:document.getElementById('contact-email').value, phone:document.getElementById('contact-phone').value, address:document.getElementById('contact-address').value };
    localStorage.setItem('contactInfo',JSON.stringify(contactInfo)); alert('Kontaktinfo gemt');
  };

  // === ADMIN MANAGEMENT ===
  function renderAdminList() {
    const ul=document.getElementById('admin-list'); ul.innerHTML='';
    admins.forEach((a,i)=>{
      const li=document.createElement('li'); li.className='bg-white p-2 rounded shadow mb-2 flex justify-between';
      li.innerHTML=`<span>${a.username}</span>${a.username!=='admin'?`<button onclick='deleteAdmin(${i})' class='bg-red-600 text-white px-2 rounded'>Slet</button>`:''}`;
      ul.appendChild(li);
    });
  }
  window.deleteAdmin=i=>{ admins.splice(i,1); localStorage.setItem('admins',JSON.stringify(admins)); renderAdminList(); };
  document.getElementById('add-admin-btn').onclick=()=>{
    const u=document.getElementById('new-admin-username').value.trim(); const p=document.getElementById('new-admin-password').value.trim();
    if(!u||!p) return alert('udfyld felter'); admins.push({username:u,password:p}); localStorage.setItem('admins',JSON.stringify(admins)); document.getElementById('new-admin-username').value=''; document.getElementById('new-admin-password').value=''; renderAdminList();
  };
});
