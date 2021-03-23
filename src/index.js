/*** GLOBAL VARIABLE ***/
const body = document.body
const url = "http://localhost:3000/ramens"
const form = body.querySelector('form#ramen-rating')


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
    form.dataset.id = ramenObj.id
    const rating = form.querySelector('input#rating')
    const comment = form.querySelector('textarea#comment')
    rating.value = `${ramenObj.rating}`
    comment.value = `${ramenObj.comment}`
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
})

form.addEventListener('submit', event => {
    if (event.target.matches('form#ramen-rating')){
            const id = event.target.dataset.id
            event.preventDefault()
            
            const rating = form.querySelector('input#rating')
            const comment = form.querySelector('textarea#comment')
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
                const rating = form.querySelector('input#rating')
                const comment = form.querySelector('textarea#comment')
                rating.value = `${ramenObj.rating}`
                comment.value = `${ramenObj.comment}`

            })
    }
})

/*** APP INIT ***/
renderAllRamen()