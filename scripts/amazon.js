import { addToCart, updateCartQuantity } from "../data/cart.js"
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js"

let productsHtml = '';

products.forEach((product) => {
  productsHtml += `
  <div class="product-container">
    <div class="product-image-container">
      <img class="product-image"
        src="${product.image}">
    </div>

    <div class="product-name limit-text-to-2-lines">
      ${product.name}
    </div>

    <div class="product-rating-container">
      <img class="product-rating-stars"
        src="images/ratings/rating-${product.rating.stars * 10}.png">
      <div class="product-rating-count link-primary">
        ${product.rating.count}
      </div>
    </div>

    <div class="product-price">
      $${formatCurrency(product.priceCents)}
    </div>

    <div class="product-quantity-container">
      <select class="js-quantity-selector-${product.id}">
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    </div>

    <div class="product-spacer"></div>

    <div class="added-to-cart js-added-to-cart-image-${product.id}">
      <img src="images/icons/checkmark.png">
      Added
    </div>

    <button class="add-to-cart-button button-primary js-add-to-cart"
            data-product-id="${product.id}">
      Add to Cart
    </button>
  </div>
  `;
})

document.querySelector(".js-cart-quantity").innerHTML = updateCartQuantity();
document.querySelector(".js-products-grid").innerHTML = productsHtml

function addAddedIcon(productId) {
  const addedMessage = document.querySelector(`.js-added-to-cart-image-${productId}`);
  addedMessage.classList.add("show-product-as-added");
  document.querySelector(".show-product-as-added").style.opacity = 1
}

document.querySelectorAll(".js-add-to-cart")
  .forEach((button) => {
    let addedMessageTimeoutId;
    button.addEventListener("click", () => {
      const { productId } = button.dataset;

      addToCart(productId)
      const cartItems = updateCartQuantity();
      document.querySelector(".js-cart-quantity").innerHTML = cartItems;
      addAddedIcon(productId)
      
      setTimeout(() => {
        if (addedMessageTimeoutId) {
          clearTimeout(addedMessageTimeoutId)
        }
        const timeoutId = setTimeout(() => {
          document.querySelector(".show-product-as-added").style.opacity = 0
          addedMessage.classList.remove("show-product-as-added");
        }, 2000) 
        addedMessageTimeoutId = timeoutId;
      });
      
    })
  });





