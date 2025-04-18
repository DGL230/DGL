/* Reset og base */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  background: #f4f4f4;
}

h1, h2, h3 {
  color: #2e7d32;
  text-align: center;
  margin-top: 20px;
}

input, textarea, button {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  box-sizing: border-box;
  font-size: 1em;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background-color: #388e3c;
}

.error {
  color: red;
  text-align: center;
}

.logout-btn {
  background: #c62828;
  margin-top: 10px;
}

/* Logo */
.logo-container {
  text-align: center;
  margin-top: 20px;
}

.logo-container img {
  max-height: 80px;
}

/* Admin layout */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2e7d32;
  color: white;
  padding: 10px 20px;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  padding: 20px;
}

.admin-box {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.admin-box:hover {
  background: #e8f5e9;
}

#admin-orders,
#admin-customers,
#admin-products,
#admin-contact-editor {
  padding: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  background: #fff;
  padding: 10px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.95em;
}
