function showWaitAndRedirect(destination) {
  const waitDiv = document.createElement("div");
  waitDiv.style.position = "fixed";
  waitDiv.style.top = "0";
  waitDiv.style.left = "0";
  waitDiv.style.width = "100%";
  waitDiv.style.height = "100%";
  waitDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  waitDiv.style.display = "flex";
  waitDiv.style.justifyContent = "center";
  waitDiv.style.alignItems = "center";
  waitDiv.style.zIndex = "9999";
  waitDiv.innerHTML = `<h1 style="color: white;">Please wait...</h1>`;
  document.body.appendChild(waitDiv);

  setTimeout(() => {
    window.location.href = destination;
  }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {

  if (location.pathname.includes("order.html")) {
    const okButtons = document.querySelectorAll(".btn-card-ok");

    okButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".card");
        const name = card.querySelector(".card-title").textContent;
        const price = parseFloat(card.querySelector(".p2").textContent.replace("$", ""));
        const image = card.querySelector("img").getAttribute("src");
        const item = { name, price, quantity: 1, image };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find(i => i.name === name);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push(item);
        }
        localStorage.setItem("cart", JSON.stringify(cart));

        btn.textContent = "✓ Added!";
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = "Add to Cart";
          btn.disabled = false;
        }, 1500);
      });
    });
  }

  if (location.pathname.includes("shop.html")) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cardBody = document.querySelector(".card-body");

    const refreshCart = () => {
      localStorage.setItem("cart", JSON.stringify(cart));
      displayCart();
    };

    const displayCart = () => {
      cardBody.innerHTML = "";
      if (cart.length === 0) {
        cardBody.innerHTML = "<p class='card-text text-center'>🛒 NO ITEMS IN CART</p>";
        return;
      }

      cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "mb-3 p-3 right-0 border rounded w-100";
        div.innerHTML = `
          <div class="d-flex align-items-center right-0 gap-3 mb-2">
            <img src="${item.image}" alt="${item.name}" width="60" height="60" class="rounded border">
            <div>
              <strong>${item.name}</strong><br>
              <span class="text-muted">$${item.price.toFixed(2)}</span>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <button class="btn btn-sm btn-outline-secondary minus">-</button>
              <span class="mx-2 quantity">${item.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary plus">+</button>
            </div>
            <button class="btn btn-sm btn-danger delete">✖</button>
          </div>
        `;

        div.querySelector(".plus").addEventListener("click", () => {
          item.quantity++;
          refreshCart();
        });

        div.querySelector(".minus").addEventListener("click", () => {
          if (item.quantity > 1) {
            item.quantity--;
            refreshCart();
          }
        });

        div.querySelector(".delete").addEventListener("click", () => {
          if (confirm("Are you sure you want to remove this item?")) {
            cart.splice(index, 1);
            refreshCart();
          }
        });

        cardBody.appendChild(div);
      });

      let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

      const totalDiv = document.createElement("div");
      totalDiv.className = "alert alert-info mt-3 w-100";
      totalDiv.innerHTML = `<h5 class="mb-0"> Total Items: ${totalItems} | Total: $${total.toFixed(2)}</h5>`;
      cardBody.appendChild(totalDiv);

      const clearBtn = document.createElement("button");
      clearBtn.textContent = "🗑️ Clear Cart";
      clearBtn.className = "btn btn-warning mt-2 w-100";
      clearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear the cart?")) {
          localStorage.removeItem("cart");
          cart = [];
          displayCart();
        }
      });
      cardBody.appendChild(clearBtn);
    };

    displayCart();
  }

  if (location.pathname.includes("buyer.html")) {
    const form = document.querySelector("#buyerForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.querySelector("#buyerName").value.trim();
      const address = document.querySelector("#buyerAddress").value.trim();
      const phone = document.querySelector("#buyerPhone").value.trim();

      if (!name || !address || !phone) {
        alert("Please fill all fields");
        return;
      }

      localStorage.removeItem("cart");

      const msg = document.createElement("div");
      msg.textContent = `Thank you, ${name}! Order confirmed.`;
      msg.style.position = "fixed";
      msg.style.top = "0";
      msg.style.left = "0";
      msg.style.width = "100%";
      msg.style.backgroundColor = "#28a745";
      msg.style.color = "white";
      msg.style.textAlign = "center";
      msg.style.padding = "15px";
      msg.style.zIndex = "9999";
      document.body.appendChild(msg);

      setTimeout(() => {
        location.href = "shop.html";
      }, 2000);
    });
  }

  const buyButton = document.querySelector(".btn-buy");
  if (buyButton) {
    buyButton.addEventListener("click", () => {
      const fullName = document.getElementById("fullName").value.trim();
      const address = document.getElementById("address").value.trim();
      const cardNumber = document.getElementById("cardNumber").value.trim();
      const cvv = document.getElementById("cvv").value.trim();

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
          alert("Your cart is empty! Add items before buying.");
          return;
        }

      if (!fullName || !address || !cardNumber || !cvv) {
        alert("Please fill in all fields.");
        return;
      }

      const msg = document.createElement("div");
      msg.textContent = "Operation completed successfully";
      msg.style.position = "fixed";
      msg.style.top = "0";
      msg.style.left = "0";
      msg.style.width = "100%";
      msg.style.backgroundColor = "#28a745";
      msg.style.color = "white";
      msg.style.textAlign = "center";
      msg.style.padding = "15px";
      msg.style.zIndex = "9999";
      document.body.appendChild(msg);

      localStorage.removeItem("cart");

      setTimeout(() => {
        location.reload();
      }, 1000);
    });
  }

  document.querySelectorAll("a").forEach(link => {
    if (link.getAttribute("target") !== "_blank") {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");

        if (!href || href === "" || href.startsWith("#")) return;

        e.preventDefault();
        showWaitAndRedirect(href);
      });
    }
  });

  const filterButtons = document.querySelectorAll(".btns button");
  const menuCards = document.querySelectorAll(".cards .card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const type = button.textContent.toLowerCase(); 

      menuCards.forEach(card => {
        const cardType = card.getAttribute("data-type");
        card.style.display = (type === "all" || cardType === type) ? "block" : "none";
      });
    });
  });
});
