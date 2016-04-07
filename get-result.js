var fs = require('fs');

fs.readFile('./reports/testResult.txt', function (err, data) {
    if (err) {
        throw 'FAIL TO CHECK TEST RESULT! CHECK testLog.txt';
    }
    if(data.toString() == 'failed'){
        throw 'MOBILE TEST FAILED! CHECK testLog.txt';
    }
});
