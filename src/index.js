/*** GLOBAL VARIABLE ***/
const body = document.body
const url = "http://localhost:3000/ramens"
const formUpdate = body.querySelector('form#ramen-rating')


/*** HELPER FUNCTION ***/
const imgRamen = (ramenObj) => {
    const img = document.createElement('img')
    img.src = ramenObj.image
    img.dataset.id = ramenObj.id
    const menuDiv = body.querySelector('div#ramen-menu')
    menuDiv.append(img)
}

const renderOneRamen = (ramenObj) => {
    const detailDiv = body.querySelector('div#ramen-detail')
    detailDiv.innerHTML = `
        <img class="detail-image" src=${ramenObj.image} alt=${ramenObj.name} />
        <h2 class="name">${ramenObj.name}</h2>
        <h3 class="restaurant">${ramenObj.restaurant}</h3>
        `
    formUpdate.dataset.id = ramenObj.id
    const rating = formUpdate.querySelector('input#rating')
    const comment = formUpdate.querySelector('textarea#comment')
    rating.value = ramenObj.rating
    comment.value = ramenObj.comment
    const dButton = document.createElement('BUTTON')
    dButton.dataset.id = ramenObj.id
    dButton.innerText = " 🙅‍♀️ "
    detailDiv.append(dButton)
}

const renderAllRamen = () => {
    fetch(url)
    .then(resp => resp.json())
    .then(ramenObjects => {
        if (ramenObjects.length > 0) {
            renderOneRamen(ramenObjects[0])
        }
        ramenObjects.forEach(ramenObj => imgRamen(ramenObj))
    })
}

const fetchRamenDetail = (event) => {
    const id = event.dataset.id
    fetch(`${url}/${id}`)
    .then(resp => resp.json())
    .then(ramenObj => {
        renderOneRamen(ramenObj)
    })
}

const updateRating = (event) => {
    const id = event.target.dataset.id
    event.preventDefault()
    console.log(event.target)

    const newRating = event.target[0].value
    const newComment = event.target[1].value

    fetch(`${url}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            rating: newRating,
            comment: newComment
        })
    })
}

const newRamen = (event) => {
    event.preventDefault() 
    const newRamen = {
        name: event.target.name.value,   
        restaurant: event.target.restaurant.value,   
        image: event.target.image.value,    
        rating: event.target.rating.value,    
        comment: event.target['new-comment'].value
    }  

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newRamen)
    })
    .then(resp => {
        if (resp.ok) {
            return resp.json()
        }
        throw new Error(resp.statusText)
        })
    .then(newRamenObj => imgRamen(newRamenObj))
    .catch(error => {
        alert(error)
        console.log(error)})
    event.target.reset()
}

const renderFirstRamen = () => {
    fetch(`${url}`)
    .then(resp => resp.json())
    .then(ramenObjs => {
        ramenObjs.forEach(ramenObj => renderOneRamen(ramenObj))
        })
}
/*** EVENT LISTENERS ***/
body.addEventListener('click', (event) => {
    if (event.target.matches('div#ramen-menu img')){
        fetchRamenDetail(event.target)
    }
    else if (event.target.matches('div#ramen-detail button')){
        const id = event.target.dataset.id
        const img = body.querySelector(`img[data-id='${id}']`)
        img.remove()
        renderFirstRamen()
        fetch(`${url}/${id}`, {
            method: "DELETE"
        })
    }
})

body.addEventListener('submit', event => {
    if (event.target.matches('form#ramen-rating')){
        updateRating(event)
    }
    else if (event.target.matches('form#new-ramen')){
        newRamen(event)
    }
})


/*** APP INIT ***/

renderAllRamen()