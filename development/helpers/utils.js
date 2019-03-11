/**
 * Print class name properly.
 * @param {String} className Class name.
 * @version 1.0.0
 */
export const printClass = (className) => {
    return className === undefined || className === '' ? '' : (' ' + className)
}

/**
 * Match (and return) the video Id
 * of any valid Youtube Url, given as input string.
 * @author: Stephan Schmitz <eyecatchup@gmail.com>
 * @url: https://stackoverflow.com/a/10315969/624466
 * @param {String} Url
 * @return {String} Youtube ID
 */
export const getYoutubeID = (Url) => {
    let regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (Url.match(regex)) ? RegExp.$1 : false;
}