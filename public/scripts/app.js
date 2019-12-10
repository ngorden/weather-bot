document.addEventListener('DOMContentLoaded', onReady)

function onReady() {
    for (let timestamp of document.querySelectorAll('td#date')){
        timestamp.innerHTML = convertTimestampDate(timestamp.innerHTML)
    }
}