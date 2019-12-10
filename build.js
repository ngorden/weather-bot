const fs = require('fs-extra')
const childProcess = require('child_process')
const path = require('path')

try {
    // Remove existing dist files
    fs.removeSync('./dist')

    const publicDir = path.join(__dirname, '..', 'src', 'public')
    const viewsDir = path.join(__dirname, '..', 'src', 'views')

    // Copy static files
    if (fs.existsSync(publicDir)) {
        fs.copySync(publicDir, publicDir.replace('src', 'dist'))
    }
    if (fs.existsSync(viewsDir)) {
        fs.copySync(viewsDir, viewsDir.replace('src', 'dist'))
    }

    childProcess.exec('tsc --build tsconfig.json')
} catch (err) {
    console.error(err)
    process.exit(1)
}
