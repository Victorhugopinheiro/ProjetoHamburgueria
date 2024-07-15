const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const itemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const CloseModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("adress-warn")

let cart = []

//abrir o modal do carrinho
cartBtn.addEventListener("click", () => {
    updateCartModal()
    cartModal.style.display = "flex"
   
})

cartModal.addEventListener("click", (e) => {
if(e.target === cartModal ){
    cartModal.style.display = "none"
}
})

CloseModalBtn.addEventListener("click", () =>{
    cartModal.style.display = "none"
})

menu.addEventListener("click", (e) => {
    let clickButton = e.target.closest(".add-to-cart-btn")

    if(clickButton){
        const name = clickButton.getAttribute("data-name")
        const price = parseFloat(clickButton.getAttribute("data-price"))

        addCart(name, price)
        
    }
})

function addCart (name,price) {
    const existingItem = cart.find(item => item.name === name )

    if(existingItem) {
        existingItem.quantity += 1
        
    }else{
        cart.push({
            name,
            price,
            quantity: 1,})
    }

updateCartModal()

}

function updateCartModal() {
    itemsContainer.innerHTML = "";
    let total = 0

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
         <div> 
         <p class="font-medium"> ${item.name} </p>
          <p>Qtd: ${item.quantity} </p>
          <p class="font-medium mt-2"> ${item.price.toFixed(2)} </p>
         </div>

         
         <button class="remove-from-cart-btn" data-name="${item.name}"> Remover </button>
         

        </div>

        `
        total += item.price * item.quantity

        itemsContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"


    })

    cartCounter.innerHTML = cart.length;
}

//Função para remover o item do carrinho


itemsContainer.addEventListener("click", (e) =>{
    if(e.target.classList.contains("remove-from-cart-btn")){
        const name = e.target.getAttribute("data-name")

        removeItemCart(name)
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
        const item = cart[index]

        if(item.quantity > 1){
            item.quantity -= 1
            updateCartModal()
            return
        }
        cart.splice(index, 1)
        updateCartModal()
        
    }
}

addressInput.addEventListener("input", (e) => {

    let inputValue = e.target.value; 


    if(inputValue !==""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})


checkoutBtn.addEventListener("click", () => {
    const isOpen = checkRestaurantOpen()
    if(!isOpen){
        
        Toastify({
            text: "Ops, o retaurante está fechado",
            duration: 3000,

            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
            }).showToast();

        
        return;
    }



    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

        //Enviar o pedido para a API do whatsapp
    const cartItems = cart.map((item) =>{
        return (` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} `)

    }).join("")
    console.log(cartItems)

    const message = encodeURIComponent(cartItems)
    const phone = "5511986767170"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = []
    updateCartModal()

})

function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >=18 & hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if(isOpen){
    spanItem.classList.remove("bg-red-600")
    spanItem.classList.add("bg-green-600")

    
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-600")
}