const renderProduct = (product) => {
    const sku = document.getElementById('current-product-sku')
    const name = document.getElementById('current-product-name')
    const type = document.getElementById('current-product-type')
    const price = document.getElementById('current-product-price')
    sku.innerText = product.sku !== '' ? product.sku : '-'
    name.innerText = product.name !== '' ? product.name : '-'
    type.innerText = product.type !== '' ? product.type : '-'
    price.innerText = product.price !== '' ? product.price : '-'
}

const getProduct = (sku) => {
    fetch('http://localhost:3000/api/products/' + sku, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(json => renderProduct(json))
}

const removeProduct = (skuNumber) => {
    const sku = document.getElementById('current-product-sku')
    const name = document.getElementById('current-product-name')
    const type = document.getElementById('current-product-type')
    const price = document.getElementById('current-product-price')
    sku.innerText = '-'
    name.innerText = '-'
    type.innerText = '-'
    price.innerText = '-'
    // remove product from products list
    // rerender products list
}

const deleteProduct = (sku) => {
    fetch('http://localhost:3000/api/products/' + sku, {
        method: 'DELETE'
    })
        .then(response => { if (response.status === 200) removeProduct(sku) } )
}

const deleteCurrentProduct = () => {
    const currentProductSKU = document.getElementById('current-product-sku').innerText
    deleteProduct(currentProductSKU)
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
    const deleteButton = document.getElementById('button-delete')
    deleteButton.addEventListener('click', deleteCurrentProduct)
})