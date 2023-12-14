export const cart = [];

export function addToCart(productId) {
  let matchingItem;
  
    cart.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        matchingItem = cartItem;
      }
    });

  const quantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
    
  if (matchingItem) matchingItem.quantity += quantity;
  else {
    cart.push({
      productId,
      quantity,
    })
  }
}

export function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity
  })
  document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
}