/*
  STYLE DIAMON
  Sistema inicial de pedidos
*/

const products = [
  {
    id: "100-10",
    diamonds: "100 + 10",
    price: 1200
  },
  {
    id: "310-31",
    diamonds: "310 + 31",
    price: 3600
  },
  {
    id: "520-52",
    diamonds: "520 + 52",
    price: 6000
  },
  {
    id: "1060-106",
    diamonds: "1.060 + 106",
    price: 10800
  },
  {
    id: "2180-218",
    diamonds: "2.180 + 218",
    price: 19500
  },
  {
    id: "5600-560",
    diamonds: "5.600 + 560",
    price: 0
  }
];

const productsGrid =
  document.getElementById("productsGrid");

const selectedProduct =
  document.getElementById("selectedProduct");


// Formato de pesos argentinos
function formatPrice(price) {

  if (price === 0) {
    return "Consultar";
  }

  return "$" + price.toLocaleString("es-AR");
}


// Crear productos
products.forEach(product => {

  const card = document.createElement("div");

  card.className = "product";

  card.innerHTML = `
    <div class="product-icon">💎</div>

    <h3>${product.diamonds} diamantes</h3>

    <p>
      Recarga para Free Fire
    </p>

    <div class="product-price">
      ${formatPrice(product.price)}
    </div>

    <button
      class="btn primary"
      onclick="selectProduct('${product.id}')">
      Comprar
    </button>
  `;

  productsGrid.appendChild(card);


  // Agregar al selector
  const option =
    document.createElement("option");

  option.value = product.id;

  option.textContent =
    `${product.diamonds} diamantes - ${formatPrice(product.price)}`;

  selectedProduct.appendChild(option);

});


// Seleccionar producto
function selectProduct(id) {

  selectedProduct.value = id;

  document
    .getElementById("compra")
    .scrollIntoView({
      behavior: "smooth"
    });
}


// Formulario
document
  .getElementById("purchaseForm")
  .addEventListener("submit", function(event) {

    event.preventDefault();

    const playerId =
      document.getElementById("playerId").value.trim();

    const playerName =
      document.getElementById("playerName").value.trim();

    const productId =
      selectedProduct.value;

    const payment =
      document.getElementById("payment").value;


    const product =
      products.find(
        item => item.id === productId
      );


    if (!product) {
      alert("Seleccioná un paquete de diamantes.");
      return;
    }


    if (!/^[0-9]{5,15}$/.test(playerId)) {

      alert(
        "Ingresá un ID de jugador válido."
      );

      return;
    }


    // Guardar temporalmente el pedido
    const order = {

      id:
        "SD-" +
        Date.now(),

      playerId,

      playerName,

      product:
        product.diamonds,

      price:
        product.price,

      payment,

      date:
        new Date().toISOString(),

      status:
        "Pendiente de pago"

    };


    localStorage.setItem(
      "styleDiamonOrder",
      JSON.stringify(order)
    );


    // Mostrar sección de pago
    document
      .getElementById("pago")
      .classList.remove("hidden");


    document
      .getElementById("pago")
      .scrollIntoView({
        behavior: "smooth"
      });

});


// Copiar CVU
document
  .getElementById("copyCvu")
  .addEventListener("click", async function() {

    const cvu =
      "0000003100087877121043";

    try {

      await navigator.clipboard.writeText(cvu);

      this.textContent =
        "✓ CVU copiado";

      setTimeout(() => {

        this.textContent =
          "Copiar CVU";

      }, 2000);

    } catch {

      alert(
        "CVU: " + cvu
      );

    }

});


// WhatsApp
document
  .getElementById("whatsappButton")
  .addEventListener("click", function() {

    const orderJSON =
      localStorage.getItem(
        "styleDiamonOrder"
      );


    if (!orderJSON) {

      alert(
        "Primero completá el pedido."
      );

      return;
    }


    const order =
      JSON.parse(orderJSON);


    let message =

`💎 *STYLEDIAMON - NUEVO PEDIDO*

🆔 ID: ${order.playerId}
👤 Nombre: ${order.playerName || "No indicado"}

💎 Paquete:
${order.product} diamantes

💰 Precio:
${formatPrice(order.price)}

💳 Método de pago:
${order.payment}

📋 Pedido:
${order.id}

Ya realicé la transferencia y envío el comprobante.

Gracias.`;



    const whatsappURL =
      "https://wa.me/5491131361153?text=" +
      encodeURIComponent(message);


    window.open(
      whatsappURL,
      "_blank"
    );

});
