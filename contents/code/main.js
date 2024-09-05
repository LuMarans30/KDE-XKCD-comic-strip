/**
 * Initializes the comic properties and fetches the comic based on the identifier specified.
 */
init = () => {
    comic.comicAuthor = "Randall Munroe"
    comic.firstIdentifier = 1
    comic.shopUrl = "https://store.kde.org/"

    const { identifierSpecified, Page, User } = comic
    getComic(identifierSpecified, identifierSpecified ? Page : User)
}

/**
 * Handles the JSON data retrieved for the current comic.
 * @param {string} id - The identifier for the retrieved data.
 * @param {string} data - The JSON data string.
 */
pageRetrieved = (id, data) => {
    let obj

    try {
        obj = typeof data === "string" && JSON.parse(data)
    } catch (ex) {
        print(`Error: ${ex}\nTried to parse: ${data}`)
        comic.error()
        return
    }

    const { User, Page, Image } = comic

    switch (id) {
        case User:
            comic.lastIdentifier = obj.num
            getComic(false, Page) // Fetch the comic with the requested identifier
            break
        case Page:
            processComic(id, obj) // Process the comic's JSON data
            break
        case Image:
            print(`Image data received for comic #${comic.identifier} at ${comic.websiteUrl}`)
            return
        default:
            print(`This function is not configured to handle responses with this ID (${id})`)
            if (id !== comic.Image) print(`Data returned: ${data}`)
            comic.error()
            break
    }
}

/**
 * Processes the comic's JSON data and sets the comic properties.
 * @param {string} id - The identifier for the comic.
 * @param {Object} jsonData - The JSON data object.
 */
processComic = (id, jsonData) => {

    const { num, title, alt, img } = jsonData

    print(`json data ${JSON.stringify(jsonData)} identifier ${id} last identifier ${num} title ${title}`)

    // Set objects properties
    comic.title = title
    comic.websiteUrl = `https://xkcd.com/${num}`
    comic.additionalText = alt

    // Set the comic identifier
    comic.identifier = num

    // Requests the actual comic image
    comic.requestPage(img, comic.Image)
}

/**
 * Fetches the latest comic if identifierSpecified is not set, else fetches the comic with the requested number.
 * @param {boolean} identifierSpecified - Indicates if an identifier is specified.
 * @param {string} id - The identifier for the comic.
 */
getComic = (identifierSpecified, id) => comic.requestPage(`https://xkcd.com/${identifierSpecified ? comic.identifier + '/' : ''}info.0.json`, id)