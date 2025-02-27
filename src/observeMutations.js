const targetNode = document.getElementById('your-target-element')
const config = { attributes: true, childList: true, subtree: true }

const callback = (mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      console.log('A child node has been added or removed.')
    } else if (mutation.type === 'attributes') {
      console.log(`The ${mutation.attributeName} attribute was modified.`)
    }
  }
}

const observer = new MutationObserver(callback)
observer.observe(targetNode, config)

// To stop observing
// observer.disconnect()
