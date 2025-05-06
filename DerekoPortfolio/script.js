const slidesContainer = document.querySelector(".slides")
let slideElements = document.querySelectorAll(".slide")
let index = 1
let isTransitioning = false

const firstClone = slideElements[0].cloneNode(true)
const lastClone = slideElements[slideElements.length - 1].cloneNode(true)
firstClone.classList.add("clone")
lastClone.classList.add("clone")

slidesContainer.appendChild(firstClone)
slidesContainer.insertBefore(lastClone, slideElements[0])

slideElements = document.querySelectorAll(".slide")

function getSlideWidth() {
    return slideElements[index]?.clientWidth || 0
}

slidesContainer.style.transform = `translateX(-${getSlideWidth() * index}px)`

function moveToSlide() {
    const width = getSlideWidth()
    slidesContainer.style.transition = "transform 0.5s ease"
    slidesContainer.style.transform = `translateX(-${width * index}px)`
}

slidesContainer.addEventListener("transitionend", () => {
    const current = slideElements[index]
    if (!current) return

    if (current.classList.contains("clone")) {
        slidesContainer.style.transition = "none"
        index = index === 0 ? slideElements.length - 2 : 1
        slidesContainer.style.transform = `translateX(-${getSlideWidth() * index}px)`
    }
    isTransitioning = false
})

document.querySelector(".next").addEventListener("click", () => {
    if (isTransitioning) return
    index++
    moveToSlide()
    isTransitioning = true
    resetAutoScroll()
})

document.querySelector(".prev").addEventListener("click", () => {
    if (isTransitioning) return
    index--
    moveToSlide()
    isTransitioning = true
    resetAutoScroll()
})

let autoScroll = setInterval(() => {
    index++
    moveToSlide()
    isTransitioning = true
}, 5000)

function resetAutoScroll() {
    clearInterval(autoScroll)
    autoScroll = setInterval(() => {
        index++
        moveToSlide()
        isTransitioning = true
    }, 4000)
}

const carousel = document.querySelector(".carousel")
carousel.addEventListener("mouseenter", () => clearInterval(autoScroll))
carousel.addEventListener("mouseleave", resetAutoScroll)

let startX = 0
let isSwiping = false

carousel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX
    isSwiping = true
}, { passive: true })

carousel.addEventListener("touchmove", (e) => {
    if (!isSwiping) return
    const diff = startX - e.touches[0].clientX
    if (Math.abs(diff) > 50) {
        index += diff > 0 ? 1 : -1
        moveToSlide()
        isTransitioning = true
        isSwiping = false
        resetAutoScroll()
    }
}, { passive: true })

carousel.addEventListener("touchend", () => {
    isSwiping = false
})
