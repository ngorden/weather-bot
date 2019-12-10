function convertTimestampDate(timestamp) {
    var date = new Date(timestamp *1000)
    var day = ('0' + date.getUTCDate()).slice(-1)
    var month = ['Jan','Feb','Mar','Apr','May','June','July', 'Aug','Sept','Oct','Nov','Dec'][date.getUTCMonth()]
    return `${month} ${date.getUTCDate()} ${date.getUTCFullYear()}`
}

function convertTimestampTime(timestamp) {
    var date = new Date(timestamp *1000)
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
