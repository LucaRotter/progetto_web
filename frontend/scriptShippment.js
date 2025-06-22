const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", () => {

  fetch(`http://localhost:8000/artisan-orders`, {
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      const orders = data.orders;
      renderOrders(orders);
    })
    .catch(error => {
      console.error("Si è verificato un errore:", error);
    });
});

function getStatusClass(purchased) {
  return purchased ? 'purchased' : 'shipped';
}

function getStatusText(purchased) {
  return purchased ? ' Purchased' : ' Shipped';
}

function getStatusIcon(purchased) {
  return purchased ? '🛒' : '📦';
}

function renderOrders(Order) {
  const container = document.getElementById("orders-container");
  container.innerHTML = "";
  let pastOrder;

  Order.forEach(order => {
    if (order.order_id !== pastOrder) {
      pastOrder = order.order_id;

      const card = document.createElement("div");
      card.className = "order-card border rounded p-3 mb-4";

      const header = document.createElement("div");
      header.className = "order-header d-flex justify-content-between align-items-center";

      const orderTitle = document.createElement("div");
      orderTitle.className = "order-id fw-bold";
      orderTitle.textContent = `Order #${order.order_id}`;

      const purchased = order.state === "confirmed";

      const status = document.createElement("div");
      status.className = `status-badge ${getStatusClass(purchased)}`;
      status.textContent = `${getStatusIcon(purchased)} ${getStatusText(purchased)}`;

      header.appendChild(orderTitle);
      header.appendChild(status);
      card.appendChild(header);

      const detailsDiv = document.createElement("div");
      detailsDiv.className = "order-details mt-3";

      const orderProducts = Order.filter(o => o.order_id === order.order_id);

      let fetches = [];

      orderProducts.forEach(p => {
        const fetchPromise = fetch(`http://localhost:8000/item/${p.item_id}`, {
          headers: { 'Content-Type': 'application/json' }
        })
          .then(response => response.json())
          .then(data => {
            const item = data.item[0];

            const productDiv = document.createElement("div");
            productDiv.className = "product-row mb-2";

            const name = document.createElement("p");
            name.textContent = `Product: ${item.name}`;

            const quantity = document.createElement("p");
            quantity.textContent = `Quantity: ${p.quantity}`;

            const price = document.createElement("p");
            pricetotla=item.price*item.quantity
            price.textContent = `Price: ${parseFloat(pricetotla).toFixed(2)}` + " €";

            productDiv.appendChild(name);
            productDiv.appendChild(quantity);
            productDiv.appendChild(price);

            detailsDiv.appendChild(productDiv);
          })
          .catch(error => {
            console.error("Errore nel fetch dell'item:", error);
          });
        fetches.push(fetchPromise);
      });

      // Alla fine di tutte le fetch crea bottone con dettagli
      Promise.all(fetches).then(() => {
        card.appendChild(detailsDiv);

        if (purchased) {
          const shipButton = document.createElement("button");
          shipButton.className = "ship-btn btn btn-primary";
          shipButton.textContent = "Ship Order";

          shipButton.onclick = () => {
            fetch(`http://localhost:8000/update-order/${order.order_id}`, {
              method: "PUT",
              headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
              }
            })
              .then(res => res.json())
              .then(() => {
                status.className = `status-badge ${getStatusClass(false)}`;
                status.textContent = `${getStatusIcon(false)} ${getStatusText(false)}`;
                shipButton.remove();
              })
              .catch(error => {
                console.error("Errore nella conferma ordine:", error);
              });
          };
          const btnWrapper = document.createElement("div");
          btnWrapper.className = "text-center text-md-end mt-3";
          btnWrapper.appendChild(shipButton);
          card.appendChild(btnWrapper);
        }
        container.appendChild(card);
      });
    }
  });
}
