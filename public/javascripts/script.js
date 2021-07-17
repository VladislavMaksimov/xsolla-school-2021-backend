const getProduct = (sku) => {
    console.log(sku)
}

const renderProducts = (products) => {
    products.forEach(product => {
        const productCard = document.createElement('div')
        productCard.className = 'product-card'
        productCard.addEventListener('click', () => getProduct(product.sku))
        const productSKU = document.createElement('h3')
        productSKU.innerText = product.sku
        productCard.appendChild(productSKU)
        const container = document.getElementById('products-container')
        container.appendChild(productCard)
    });
}

const getProducts = () => {
    fetch('http://localhost:3000/api/products', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(json => renderProducts(json))
}

const postData = (name, type, price) => {

    const data = {
        name: name,
        type: type,
        price: price
    }

    fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(json => console.log(json));
}

const postProduct = () => {
    const name = document.getElementById('name').value
    const type = document.getElementById('type').value
    const price = document.getElementById('price').value
    postData(name, type, price)
}

window.addEventListener('load', () => {
    getProducts()
    const postButton = document.getElementById('button-post')
    postButton.addEventListener('click', postProduct)
})