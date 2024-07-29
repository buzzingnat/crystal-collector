const fs = require('fs');
const path = require('path');
const stream = fs.openSync((path.join(__dirname, '..', 'src', 'isSteam.js')), 'w');
fs.writeSync(stream, 'const IS_STEAM = false;\nmodule.exports = {IS_STEAM};\n');
fs.closeSync(stream);
