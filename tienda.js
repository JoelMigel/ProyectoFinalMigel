const btnCart = document.querySelector(".container-cart-icon")

const containerCartProducts = document.querySelector(".container-cart-products")


btnCart.addEventListener("click", ()=> {
    containerCartProducts.classList.toggle("hidden-cart")
})


const cartInfo = document.querySelector(".cart-product")
const rowProduct = document.querySelector(".row-product")


const productList = document.querySelector(".container-items");




let allProducts = JSON.parse(localStorage.getItem("carrito")) || [];

let valortotal = document.querySelector(".total-pagar")

const countProducts = document.querySelector("#contador-productos")


productList.addEventListener("click", e => {
    if(e.target.classList.contains("btnCompra")){
       const product = e.target.parentElement

       const infoProduct = {
        quantity: 1,
        title: product.querySelector("h2").textContent,
        price: product.querySelector("p").textContent,
       };

       const exits = allProducts.some(product => product.title === infoProduct.title)
       
       if (exits){
        const products = allProducts.map(product =>{
            if(product.title === infoProduct.title){
                product.quantity++;
                return product
            } else{
                return product
            }
        })
        allProducts = [...products]
       } else{
        allProducts = [...allProducts, infoProduct];
       }

       showHTML();
       saveLocal();
    }

} );

rowProduct.addEventListener ("click", (e) => {
        if(e.target.classList.contains("icon-close")){
            const product = e.target.parentElement
            const title = product.querySelector("p").textContent

            allProducts = allProducts.filter( product => product.title !== title
                );

                console.log(allProducts)
                showHTML();
        }
}
)


const showHTML = () => {


    if(!allProducts.length){
        containerCartProducts.innerHTML=`
        <p class=cart-empty">el carrito esta vacio</p>
        `
    }

    rowProduct.innerHTML="";

    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach(product => {
    const containerProduct = document.createElement("div");
    containerProduct.classList.add ("cart-product");

    containerProduct.innerHTML = `
    <div class="info-cart-product">
             <span class="cantidad-producto-carrito">${product.quantity}</span>
             <p class="titulo-producto-carrito">${product.title}</p>
             <span class="precio-producto-carrito">${product.price}</span>
       </div>
       <svg xmlns="http://www.w3.org/2000/svg" 
            fill="none" viewBox="0 0 24 24" 
            stroke-width="1.5" 
            stroke="currentColor" 
            class="icon-close"
            >
           <path stroke-linecap="round" 
           stroke-linejoin="round"
           d="M6 18L18 6M6 6l12 12" 
           />
  </svg>
    `
    rowProduct.append(containerProduct)

    total = total + parseInt(product.quantity * product.price.slice(1));
    totalOfProducts = totalOfProducts + product.quantity;
  });

  valortotal.innerText = `$${total}`;
  countProducts.innerText = totalOfProducts;
}

const saveLocal = () =>{
    localStorage.setItem("carrito",JSON.stringify(allProducts))
};

document.addEventListener("DOMContentLoaded", function() {
    let btnCompra = document.querySelector(".btnCompra");

    if (btnCompra) {
        btnCompra.addEventListener("click", function(){
            Toastify({
                text: "producto agregado!",
                duration: 3000
            }).showToast();
        });
    }
});



const stripe = Stripe('pk_test_Dt4ZBItXSZT1EzmOd8yCxonL');



productList.addEventListener("click", e => {
    if (e.target.classList.contains("btnCompra")) {
        const product = e.target.parentElement


        stripe.redirectToCheckout({
            items: [{
                quantity: infoProduct.quantity,
                price: 'precio_del_producto_en_stripe',
            }],
            successUrl: "pago exitoso",
            cancelUrl: "pago cancelado",
        })
        .then(function (result) {
            if (result.error) {

                alert(result.error.message);
            }
        });
    }
});



