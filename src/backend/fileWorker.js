let fs = require("fs");

function makeUserDirectory(userId) {
    let dir = `./downloads`;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    dir = `./downloads/${userId}`;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

module.exports = makeUserDirectory;
