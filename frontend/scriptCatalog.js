
document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    let valoreA = params.get('A');

    valoreA = parseInt(valoreA)

    fetch(`http://localhost:8000/user-items/${valoreA}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            data.items.forEach(element => {
                ProductCreation(element)
            })

        })
        .catch(error => {
            console.error("Si è verificato un errore:", error);
        })

    fetch(`http://localhost:8000/userby/${valoreA}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            initProfile(data.user)
        })
        .catch(error => {
            console.error("Si è verificato un errore:", error);
        })

    const initalNItems = getCardCountByScreenWidth()
    fetch(`http://localhost:8000/random-items?nItems=${initalNItems}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'authorization': `Bearer ${token}` })
        }
    })
        .then(Response => Response.json())
        .then(Data => {
            for (let i = 0; i < initalNItems; i++) {

                const list = document.getElementById("ProductList")
                list.appendChild(ProductCreation(Data.selectedItems[i]))

            }

        })

})

function initProfile(profile) {
    const nome = document.getElementById("nomeArtisan");
    const image = document.getElementById("imageprofile")

    nome.textContent = profile.name

    if(profile.image_url != null){
    image.src = profile.image_url
}

}

function ProductCreation(Data) {


    row = document.getElementById("ProductList")
    const card = document.createElement('div');
    card.className = 'col';
    card.id = Data.item_id;
    card.setAttribute('onclick', `window.location.href='ViewProduct.html?id=${Data.item_id}'`);

    const cardStructure = document.createElement('div');
    cardStructure.className = 'card product-item';

    const img = document.createElement('img');
    img.src = Data.image_url;
    img.className = 'card-img-top img-card';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex-column w-100 p-2';

    const title = document.createElement('p');
    title.className = 'card-text text-truncate mb-0 Item-Name';
    title.textContent = Data.name;

    const price = document.createElement('p');
    price.className = 'card-text Items price-Item';
    price.textContent = Data.price + " €";

    // Assembla la struttura
    cardBody.appendChild(title);
    cardBody.appendChild(price);

    cardStructure.appendChild(img);
    cardStructure.appendChild(cardBody);

    card.appendChild(cardStructure)
    row.appendChild(card)
}