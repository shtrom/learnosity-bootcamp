/**
 * A class for managing a queue of ajax requests. 
 * It ensures that no more than 'maxActiveRequests' are running at a time.
 * By default, Chrome limits the number of ajax requests a page can have open to 6.
 * Right now it only supports get requests.
 */
function AjaxQueue(maxActiveRequests) {
    if (!maxActiveRequests) {
        maxActiveRequests = 6;
    }

    this.maxActiveRequests = maxActiveRequests;
    this.queue = [];
    this.xhrPool = [];

}

AjaxQueue.prototype.get = function (url, prms, responseType) {
    if (!responseType) {
        responseType = 'json';
    }

    if (prms) {
        url += this._jsonToQueryString(prms);
    }

    var p = new Promise(function (res, rej) {
        this.queue.push({
            method: 'GET',
            url: url,
            resolve: res,
            reject: rej,
            responseType: responseType
        });
    }.bind(this));
    this._checkQueue();
    return p;
};

AjaxQueue.prototype._checkQueue = function () {
    if (this.queue[0] && this.xhrPool.length <= this.maxActiveRequests) {
        var req = this.queue.shift();
        this._start(req);
    }
};

AjaxQueue.prototype._start = function (req) {
    var res = req.resolve;
    var rej = req.reject;

    var xhr = new XMLHttpRequest();
    this._addToPool(xhr);

    var success = function () {
        this._removeFromPool(xhr);
        res(xhr.response);
        this._checkQueue();
    }.bind(this);

    var fail = function () {
        this._removeFromPool(xhr);
        rej();
        this._checkQueue();
    }.bind(this);

    xhr.responseType = req.responseType;
    xhr.addEventListener('load', success);
    xhr.addEventListener('abort', fail);
    xhr.addEventListener('error', fail);
    xhr.open(req.method, req.url);
    xhr.send();
};

AjaxQueue.prototype._addToPool = function (xhr) {
    this.xhrPool.push(xhr);
};

AjaxQueue.prototype._removeFromPool = function (xhr) {
    var index = this.xhrPool.indexOf(xhr);
    if (index > -1) {
        this.xhrPool.splice(index, 1);
    }
};

AjaxQueue.prototype._jsonToQueryString = function (json) {
    return '?' +
        Object.keys(json).map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
        }).join('&');
};