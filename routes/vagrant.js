var express = require('express'),
    router = express.Router(),
    sh = require('exec-sh'),
    cache = {}
;

router.param("id", function(request, respose, next, id) {
    if (/[a-f0-9]{7}/.test(id)) {
        next();
    } else {
        next(new Error("Invalid ID ["+id+"]"));
    }
});

router.route('/global-status')
    .get(function(request, response, next) {
        sh("vagrant global-status", true, function(error, stdout, stderr) {
            if (error) {
                return next(error);
            }
            var _parsedResponse = [];
            var _parsedstdout = stdout.split(/[\n\r]{1,}/);
            _parsedstdout.forEach(function(record) {
                if (/^[a-f0-9]{7}/i.test(record)) {
                    var _thisSplitRecord = record.split(/\s{1,}/);
                    var _thisDataObject = {
                        id: _thisSplitRecord[0],
                        name: _thisSplitRecord[1],
                        provider: _thisSplitRecord[2],
                        state: _thisSplitRecord[3],
                        directory: _thisSplitRecord[4]
                    };
                    _parsedResponse.push(_thisDataObject);
                    cache[_thisSplitRecord[0]] = _thisDataObject;
                }
            });
            response.json(_parsedResponse);
        });
    }) // close get
;

router.route('/status/:id')
    .get(function(request, response, next) {
        sh("vagrant status " + request.params.id, true, function(error, stdout, stderr) {
            if (error) {
                return next(error);
            }
            var _parsedResponse = [];
            var _parsedstdout = stdout.split(/[\n\r]{1,}/);
            _parsedstdout.forEach(function(record) {
                if (/[\s]{3,}/i.test(record)) {
                    var _thisSplitRecord = record.split(/\s{1,}/);
                    _parsedResponse.push({
                        id: request.params.id,
                        name: _thisSplitRecord[0],
                        state: _thisSplitRecord[1],
                        provider: _thisSplitRecord[2].replace(/[\(\)]/g,""),
                        directory: cache[request.params.id].directory || "n/a"
                    });
                }
            });
            response.json(  ((_parsedResponse.length == 1)?_parsedResponse[0]:_parsedResponse)  );
        });
    }) // close get
;

router.route('/up/:id')
    .get(function(request, response, next) {
        sh("vagrant up " + request.params.id, true, function(error, stdout, stderr) {
            if (error) {
                return next(error);
            }
            var _parsedstdout = stdout.split(/[\n\r]{1,}/);
            response.json( _parsedstdout );
        });
    }) // close get
;

router.route('/halt/:id')
    .get(function(request, response, next) {
        sh("vagrant halt " + request.params.id, true, function(error, stdout, stderr) {
            if (error) {
                return next(error);
            }
            var _parsedstdout = stdout.split(/[\n\r]{1,}/);
            response.json( _parsedstdout );
        });
    }) // close get
;

router.route('/suspend/:id')
    .get(function(request, response, next) {
        sh("vagrant halt " + request.params.id, true, function(error, stdout, stderr) {
            if (error) {
                return next(error);
            }
            var _parsedstdout = stdout.split(/[\n\r]{1,}/);
            response.json( _parsedstdout );
        });
    }) // close get
;

module.exports = router;
