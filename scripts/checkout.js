import { cart, removeFromCart, updateCartQuantity, updateQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { hello } from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

hello();
const today = dayjs();
const deliveryDate = today.add(7, "days");
console.log(deliveryDate.format("dddd, MMMM D"));

let cartSummaryHtml = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;
  let matchingProduct;
  products.forEach((productItem) => {
    if(productItem.id === productId) matchingProduct = productItem
  });

  cartSummaryHtml += `
  <div class="cart-item-container 
    js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date">
      Delivery date: Wednesday, June 15
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

        <div class="delivery-option">
          <input type="radio" class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              Tuesday, June 21
            </div>
            <div class="delivery-option-price">
              FREE Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option">
          <input type="radio" checked class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              Wednesday, June 15
            </div>
            <div class="delivery-option-price">
              $4.99 - Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option">
          <input type="radio" class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              Monday, June 13
            </div>
            <div class="delivery-option-price">
              $9.99 - Shipping
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
});

let cartItems = updateCartQuantity();
document.querySelector(".js-cart-quantity").innerHTML = `Checkout (${cartItems} items)`
document.querySelector(".js-order-summary")
  .innerHTML = cartSummaryHtml;

document.querySelectorAll(".js-delete-link")
  .forEach((deleteLink) => {
    deleteLink.addEventListener("click", () => {
      const { productId } = deleteLink.dataset;
      removeFromCart(productId);
      document.querySelector(`.js-cart-item-container-${productId}`)
        .remove();

      cartItems = updateCartQuantity();
      document.querySelector(".js-cart-quantity").innerHTML = `Checkout (${cartItems} items)`
    })
  });

document.querySelectorAll(".js-update-link")
  .forEach((updateLink) => {
    updateLink.addEventListener("click", () => {
      const productId = updateLink.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.add('is-editing-quantity');      
    });
  });

document.querySelectorAll(".js-save-link").
  forEach((saveLink) => {
    saveLink.addEventListener("click", () => {
      const productId = saveLink.dataset.productId;
      const quantity = Number(document.querySelector(".quantity-input").value);
      updateQuantity(productId, quantity)
      updateCartQuantity();
      location.reload();
    });
    
  });