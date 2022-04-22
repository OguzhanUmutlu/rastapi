// noinspection JSUnusedGlobalSymbols

const fs = require("fs");

class Method {
    static ACL = "ACL";
    static BIND = "BIND";
    static CHECKOUT = "CHECKOUT";
    static CONNECT = "CONNECT";
    static COPY = "COPY";
    static DELETE = "DELETE";
    static GET = "GET";
    static HEAD = "HEAD";
    static LINK = "LINK";
    static LOCK = "LOCK";
    static M_SEARCH = "M-SEARCH";
    static MERGE = "MERGE";
    static MKACTIVITY = "MKACTIVITY";
    static MKCALENDAR = "MKCALENDAR";
    static MKCOL = "MKCOL";
    static MOVE = "MOVE";
    static NOTIFY = "NOTIFY";
    static OPTIONS = "OPTIONS";
    static PATCH = "PATCH";
    static POST = "POST";
    static PROPFIND = "PROPFIND";
    static PROPPATCH = "PROPPATCH";
    static PUT = "PUT";
    static REBIND = "REBIND";
    static REPORT = "REPORT";
    static SEARCH = "SEARCH";
    static SOURCE = "SOURCE";
    static SUBSCRIBE = "SUBSCRIBE";
    static TRACE = "TRACE";
    static UNBIND = "UNBIND";
    static UNLINK = "UNLINK";
    static UNLOCK = "UNLOCK";
    static UNSUBSCRIBE = "UNSUBSCRIBE";

    constructor(name) {
        this.name = name;
    }
}

class StatusCodes {
    static CONTINUE = 100;
    static SWITCHING_PROTOCOLS = 101;
    static PROCESSING = 102;
    static EARLY_HINTS = 103;
    static OK = 200;
    static CREATED = 201;
    static ACCEPTED = 202;
    static NON_AUTHORITATIVE_INFORMATION = 203;
    static NO_CONTENT = 204;
    static RESET_CONTENT = 205;
    static PARTIAL_CONTENT = 206;
    static MULTI_STATUS = 207;
    static ALREADY_REPORTED = 208;
    static IM_USED = 226;
    static MULTIPLE_CHOICES = 300;
    static MOVED_PERMANENTLY = 301;
    static FOUND = 302;
    static SEE_OTHER = 303;
    static NOT_MODIFIED = 304;
    static USE_PROXY = 305;
    static TEMPORARY_REDIRECT = 307;
    static PERMANENT_REDIRECT = 308;
    static BAD_REQUEST = 400;
    static UNAUTHORIZED = 401;
    static PAYMENT_REQUIRED = 402;
    static FORBIDDEN = 403;
    static NOT_FOUND = 404;
    static METHOD_NOT_ALLOWED = 405;
    static NOT_ACCEPTABLE = 406;
    static PROXY_AUTHENTICATION_REQUIRED = 407;
    static REQUEST_TIMEOUT = 408;
    static CONFLICT = 409;
    static GONE = 410;
    static LENGTH_REQUIRED = 411;
    static PRECONDITION_FAILED = 412;
    static PAYLOAD_TOO_LARGE = 413;
    static URI_TOO_LONG = 414;
    static UNSUPPORTED_MEDIA_TYPE = 415;
    static RANGE_NOT_SATISFIABLE = 416;
    static EXPECTATION_FAILED = 417;
    static IM_A_TEAPOT = 418;
    static MISDIRECTED_REQUEST = 421;
    static UNPROCESSABLE_ENTITY = 422;
    static LOCKED = 423;
    static FAILED_DEPENDENCY = 424;
    static TOO_EARLY = 425;
    static UPGRADE_REQUIRED = 426;
    static PRECONDITION_REQUIRED = 428;
    static TOO_MANY_REQUESTS = 429;
    static REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
    static UNAVAILABLE_FOR_LEGAL_REASONS = 451;
    static INTERNAL_SERVER_ERROR = 500;
    static NOT_IMPLEMENTED = 501;
    static BAD_GATEWAY = 502;
    static SERVICE_UNAVAILABLE = 503;
    static GATEWAY_TIMEOUT = 504;
    static HTTP_VERSION_NOT_SUPPORTED = 505;
    static VARIANT_ALSO_NEGOTIATES = 506;
    static INSUFFICIENT_STORAGE = 507;
    static LOOP_DETECTED = 508;
    static BANDWIDTH_LIMIT_EXCEEDED = 509;
    static NOT_EXTENDED = 510;
    static NETWORK_AUTHENTICATION_REQUIRED = 511;
}

class RastResponse {
    constructor(request, response) {
        this._request = request;
        this._response = response;
        this._ended = false;
        this.url = request.url;
    }

    end(string, contentType = "text/json") {
        if (this._ended) return false;
        this._ended = true;
        this._response.writeHead(200, {"Content-Type": contentType});
        this._response.end(string);
        return true;
    }

    /**
     * @param path
     * @returns {boolean}
     */
    file(path) {
        if (this._ended) return false;
        this._ended = true;
        fs.createReadStream(path).pipe(this._response);
        return true;
    }
}

let _icon = 0;

class RastIcon {
    constructor(data) {
        this.data = data;
    }

    /**
     * @param {string | Buffer | Buffer[]} data
     * @returns {RastIcon}
     */
    static createFromData(data) {
        return new RastIcon(data);
    }

    /**
     * @param {string} url
     * @return {Promise<RastIcon>}
     */
    static createFromURL(url) {
        return new Promise(rr => (url.startsWith("http://") ? require("http") : require("https")).get(url, r => {
            let body = "";
            r.on("data", c => body += c);
            r.on("end", () => rr(this.createFromData(body)));
        }));
    }
}


class RastServer {
    /**
     * @type {Map<string, Map<string, {type: string, cb: function}>>}
     * @private
     */
    _readers = new Map();
    /**
     * @type {RastIcon | null}
     * @private
     */
    _icon = null;

    constructor(http = true) {
        /**
         * @type {Server}
         * @private
         */
        this._server = (http ? require("http") : require("https")).createServer((req, res) => {
                if (req.url === "/favicon.ico" && req.method === "GET" && this._icon) {
                    res.statusCode = 200;
                    res.setHeader("Content-Length", this._icon.data.length);
                    res.setHeader("Content-Type", "image/x-icon");
                    res.setHeader("Cache-Control", "public, max-age=2592000");
                    res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
                    res.end(this._icon.data);
                    return;
                }
                if (!this._readers.has(req.method)) return;
                const urls = Array.from(this._readers.get(req.method)).map(i => i[0]);
                let vars = {};
                const dataUrl = urls.find(i => i === req.url) || urls.find(a => {
                    vars = {};
                    const A = a.split("/").slice(1);
                    const B = req.url.split("/").slice(1);
                    if (A.length !== B.length) return false;
                    let all = false;
                    for (let i = 0; i < A.length; i++) {
                        if (A[i] === "*") {
                            all = true;
                            continue;
                        }
                        if (A[i].startsWith(":")) {
                            vars[A[i].split("").slice(1).join("")] = B[i];
                            continue;
                        }
                        if (A[i] !== B[i] && !all) return false;
                    }
                    return true;
                });
                if (req.method === "GET") {
                    const response = new RastResponse(req, res, vars);
                    if (this._readers.get(Method.GET).has(dataUrl)) {
                        const res = this._readers.get(Method.GET).get(dataUrl);
                        const cb = res.cb(response, vars);
                        if (cb === undefined) return;
                        switch (res.type) {
                            case "file":
                                response.file(cb);
                                break;
                            case "json":
                                response.end(JSON.stringify(cb));
                                break;
                        }
                        if (res.type === "file") response.file(cb);
                        else response.end(JSON.stringify(typeof cb === "object" ? cb : {error: "Invalid response"}));
                    } else {
                        if (this._readers.has("404")) response.end(JSON.stringify(this._readers.get("404").get("*").cb(response)));
                    }
                } else if (req.method === "POST") {
                    return; // TODO
                    let body = "";
                    req.on("data", c => body += c);
                    req.on("end", () => {
                        res.writeHead(StatusCodes.OK, {"Content-Type": "text/json"});
                        res.end(body);
                    });
                }
            }
        );
    }

    /**
     * @param port
     * @param hostname
     * @param backlog
     * @param listeningListener
     * @return {Promise<void> | void}
     */
    listen(port = 80, hostname, backlog, listeningListener) {
        if (this._server.listening) throw new Error("Server is already being listening!");
        if (hostname) this._server.listen(port, hostname, backlog, listeningListener);
        else return new Promise(r => this._server.listen(port, () => r()));
    }

    /*** @param {RastIcon} icon */
    setIcon(icon) {
        this._icon = icon;
    }

    /**
     * @param {function} cb
     * @param {string?} method
     * @param {string?} url
     */
    read(cb, method, url) {
        let m = method ? {method, url} : mode;
        if (!m) throw new Error("Mode not set!");
        if (!this._readers.has(m.method)) this._readers.set(m.method, new Map());
        this._readers.get(m.method).set(m.url, {type: "read", cb});
    }

    /**
     * @param {function} cb
     * @param {string?} method
     * @param {string?} url
     */
    json(cb, method, url) {
        let m = method ? {method, url} : mode;
        if (!m) throw new Error("Mode not set!");
        if (!this._readers.has(m.method)) this._readers.set(m.method, new Map());
        this._readers.get(m.method).set(m.url, {type: "json", cb});
    }

    /**
     * @param {function} cb
     * @param {string?} method
     * @param {string?} url
     */
    file(cb, method, url) {
        let m = method ? {method, url} : mode;
        if (!m) throw new Error("Mode not set!");
        if (!this._readers.has(m.method)) this._readers.set(m.method, new Map());
        this._readers.get(m.method).set(m.url, {type: "file", cb});
    }
}

class RastServerHTTP
    extends RastServer {
    constructor() {
        super();
    }
}

class RastServerHTTPS extends RastServer {
    constructor() {
        super(false);
    }
}

/*** @type {null | {method: string, url: string}} */
let mode = null;

global["$rast"] = class RastGlobal {
    static get(url) {
        mode = {method: Method.GET, url};
    }

    static notFound() {
        mode = {method: "404", url: "*"};
    }

    static VERSION = "0.0.1";

    static Icon = RastIcon;

    static STATUS_CODES = StatusCodes;
    static METHODS = Method;

    static httpServer = RastServerHTTP;
    static httpsServer = RastServerHTTPS;
}