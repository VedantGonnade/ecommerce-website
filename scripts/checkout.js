import {
  cart,
  removeFromCart,
  updateCartQuantity,
  updateQuantity,
  updateDeliveryOption,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../data/deliveryOption.js";

let cartSummaryHtml = "";
const today = dayjs();

cart.forEach((cartItem) => {
  const productId = cartItem.productId;
  let matchingProduct;
  products.forEach((productItem) => {
    if (productItem.id === productId) matchingProduct = productItem;
  });

  const deliveryOptionId = cartItem.deliveryOptionId;
  let deliveryOption;
  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });
  const deliverDate = today
    .add(deliveryOption.deliveryDays, "days")
    .format("dddd, MMMM D");

  cartSummaryHtml += `
  <div class="cart-item-container 
    js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date">
      Delivery date: ${deliverDate}
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          $${formatCurrency(matchingProduct.priceCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary js-update-link"
          data-product-id="${matchingProduct.id}">
            Update
            <input class="quantity-input">
            <span class="save-quantity-link link-primary js-save-link"
            data-product-id="${matchingProduct.id}">
              Save
            </span>
          </span>
          
          <span class="delete-quantity-link link-primary js-delete-link"
          data-product-id="${matchingProduct.id}">
            Delete
          </span>
        </div>
      </div>
      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        ${deliveryOptionsHtml(matchingProduct, cartItem)}
      </div>
    </div>
  </div>
  `;
});

function deliveryOptionsHtml(matchingProduct, cartItem) {
  let html = "";
  deliveryOptions.forEach((deliveryOption) => {
    
    const deliveryDate = today
      .add(deliveryOption.deliveryDays, "days")
      .format("dddd, MMMM D");

    const priceString =
      deliveryOption.priceCents === 0
        ? "FREE"
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId

    html += `
    <div class="delivery-option js-delivery-option"
      data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${deliveryOption.id}">
      <input type="radio" 
        ${isChecked ? "checked" : ""}
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}">
      <div>
        <div class="delivery-option-date">
          ${deliveryDate}
        </div>
        <div class="delivery-option-price">
          ${priceString} Shipping
        </div>
      </div>
    </div>
  `;
  });
  return html;
}

let cartItems = updateCartQuantity();
document.querySelector(
  ".js-cart-quantity"
).innerHTML = `Checkout (${cartItems} items)`;
document.querySelector(".js-order-summary").innerHTML = cartSummaryHtml;

document.querySelectorAll(".js-delete-link").forEach((deleteLink) => {
  deleteLink.addEventListener("click", () => {
    const { productId } = deleteLink.dataset;
    removeFromCart(productId);
    document.querySelector(`.js-cart-item-container-${productId}`).remove();

    cartItems = updateCartQuantity();
    document.querySelector(
      ".js-cart-quantity"
    ).innerHTML = `Checkout (${cartItems} items)`;
  });
});

document.querySelectorAll(".js-update-link").forEach((updateLink) => {
  updateLink.addEventListener("click", () => {
    const productId = updateLink.dataset.productId;
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.classList.add("is-editing-quantity");
  });
});

document.querySelectorAll(".js-save-link").forEach((saveLink) => {
  saveLink.addEventListener("click", () => {
    const productId = saveLink.dataset.productId;
    const quantity = Number(document.querySelector(".quantity-input").value);
    updateQuantity(productId, quantity);
    updateCartQuantity();
    location.reload();
  });
});

document.querySelectorAll(".js-delivery-option")
  .forEach((deliveryOption) => {
    deliveryOption.addEventListener("click", () => {
      const {productId, deliveryOptionId} = deliveryOption.dataset;
      updateDeliveryOption(productId, deliveryOptionId)
    })
});