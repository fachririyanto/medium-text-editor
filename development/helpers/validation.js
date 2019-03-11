/**
 * Check if variable is function object.
 * @param {Function} function
 * @return {Boolean}
 */
export const isFunction = (functionToCheck) => {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
}

/**
 * Check if user open on mobile dimension.
 * @return {Boolean}
 */
export const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false
}

/**
 * Validate if is youtube video URL.
 * @param {String} Url
 * @return {Boolean}
 */
export const isYoutubeVideo = (Url) => {
    let regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
    return regex.test(Url)
}