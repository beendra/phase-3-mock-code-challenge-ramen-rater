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
    rating.value = `${ramenObj.rating}`
    comment.value = `${ramenObj.comment}`
    const dButton = document.createElement('BUTTON')
    dButton.dataset.id = ramenObj.id
    dButton.innerText = " 🙅‍♀️ "
    detailDiv.append(dButton)
}

const renderAllRamen = () => {
    fetch(url)
    .then(resp => resp.json())
    .then(ramenObjects => {
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

// const updateRamen = (event) => {
//     const id = event.dataset.id
//     event.preventDefault()
//     const rating = event.target[0].value
//     const comment = event.target[1].value
//     fetch(`${url}/${id}`, {
//         method: "PATCH",
//         headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json"
//         },
//         body: JSON.stringify({
//             rating: rating,
//             comment: comment
//         })
//     })
//     .then(resp => resp.json())
//     .then(ramenObj => {
//         renderOneRamen(ramenObj)
//     })
// }

/*** EVENT LISTENERS ***/
body.addEventListener('click', (event) => {
    if (event.target.matches('div#ramen-menu img')){
        fetchRamenDetail(event.target)
    }
    else if (event.target.matches('div#ramen-detail button')){
        const id = event.target.dataset.id
        const img = body.querySelector('img[data-id="`${id}`"]')
        debugger
        img.remove()
        fetch(`${url}/${id}`, {
            method: "DELETE"
        })
    }
})

body.addEventListener('submit', event => {
    if (event.target.matches('form#ramen-rating')){
            const id = event.target.dataset.id
            event.preventDefault()
            
            const rating = formUpdate.querySelector('input#rating')
            const comment = formUpdate.querySelector('textarea#comment')
            const newRating = event.target[0].value
            const newComment = event.target[1].value
            rating.value = newRating
            comment.value = newComment
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
            .then(resp => resp.json())
            .then(ramenObj => {
                const rating = formUpdate.querySelector('input#rating')
                const comment = formUpdate.querySelector('textarea#comment')
                rating.value = `${ramenObj.rating}`
                comment.value = `${ramenObj.comment}`
            })
    }
    else if (event.target.matches('form#new-ramen')){
        event.preventDefault()   
        const newName = event.target[0].value   
        const newRestaurant = event.target[1].value   
        const newImage = event.target[2].value    
        const newRating = event.target[3].value    
        const newComment = event.target[4].value    

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: newName,
                restaurant: newRestaurant,
                image: newImage,
                rating: newRating,
                comment: newComment
            })
        })
        .then(resp => resp.json())
        .then(newRamenObj => renderOneRamen(newRamenObj))
        event.target.reset()
    }
    
})

/*** APP INIT ***/
document.addEventListener("DOMContentLoaded", (event) => {
    fetch(`${url}/1`)
    .then(resp => resp.json())
    .then(ramenObj => {renderOneRamen(ramenObj)})
})
renderAllRamen()