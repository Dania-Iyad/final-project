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
        const quantity = 1;
        const item = { name, price, quantity };
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find(i => i.name === name);
        if (existing) {
          existing.quantity += quantity;
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
    const container = document.querySelector(".container");

    const refreshCart = () => {
      localStorage.setItem("cart", JSON.stringify(cart));
      displayCart();
    };

    const displayCart = () => {
      cardBody.innerHTML = "";
      if (cart.length === 0) {
        cardBody.innerHTML = "<p class='card-text'>NO ITEMS</p>";
        return;
      }
      cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "d-flex justify-content-between align-items-center mb-2";
        div.innerHTML = `
          <div>
            <strong>${item.name}</strong> - $${item.price.toFixed(2)} × 
            <button class="btn btn-sm btn-outline-secondary minus">-</button>
            <span class="mx-2 quantity">${item.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary plus">+</button>
          </div>
          <button class="btn btn-sm btn-danger delete">✖</button>
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
      const totalDiv = document.createElement("div");
      totalDiv.className = "alert alert-info mt-3";
      totalDiv.innerHTML = `<h5 class="mb-0">Total: $${total.toFixed(2)}</h5>`;
      cardBody.appendChild(totalDiv);
      const clearBtn = document.createElement("button");
      clearBtn.textContent = "Clear Cart";
      clearBtn.className = "btn btn-warning mt-2";
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

    const buyBtn = document.querySelector(".btn-buy");
    if (buyBtn) {
      buyBtn.addEventListener("click", () => {
        localStorage.removeItem("cart");
        cart = [];
        const inputs = document.querySelectorAll(".input");
        inputs.forEach(input => input.value = "");

        const successMsg = document.createElement("div");
        successMsg.textContent = "✅ Your purchase was successful! Thank you.";
        successMsg.style.position = "fixed";
        successMsg.style.top = "0";
        successMsg.style.left = "0";
        successMsg.style.width = "100%";
        successMsg.style.backgroundColor = "#28a745";
        successMsg.style.color = "white";
        successMsg.style.textAlign = "center";
        successMsg.style.padding = "15px";
        successMsg.style.zIndex = "9999";
        successMsg.style.opacity = "0";
        successMsg.style.transition = "opacity 0.5s ease";

        document.body.appendChild(successMsg);

        setTimeout(() => {
          successMsg.style.opacity = "1";
        }, 10); 

        setTimeout(() => {
          successMsg.style.opacity = "0";
          setTimeout(() => {
            successMsg.remove();
            location.reload();
          }, 500); 
        }, 2000);
      });
    }


  }

  document.querySelectorAll("a").forEach(link => {
    if (link.getAttribute("target") !== "_blank") {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = link.getAttribute("href");
        if (href && href !== "#") {
          showWaitAndRedirect(href);
        }
      });
    }
  });
});
