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
    const postButton = document.getElementById('button-post')
    postButton.addEventListener('click', postProduct)
})