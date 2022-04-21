# RastAPI

Fast and easy-to-use API maker made for JavaScript

## Usage

### Setup

- CommonJS

```javascript
require("rastapi");
```

- Module

```javascript
import RastAPI from "rastapi";
```

### Create Server

- HTTP

```javascript
const server = new $rast.httpServer();
```

- HTTPS

```javascript
const server = new $rast.httpsServer();
```

### Listening on port

```javascript
server.listen(80).then(() => console.log("I am listening on port 80 ✨"));
```

### Create Page

- GET with an object

```javascript
$rast.get("/");
server.json(() => {
    return {
        "message": "Hello World ✨"
    };
});
```

- GET with a file

```javascript
$rast.get("/myfile");
server.file(() => "./myfile.json");
```

### Using url variables

```javascript
$rast.get("/test/:test");
server.json((res, vars) => {
    return {"message": "You are in /test/" + vars.test};
});
```

### Not found page

```javascript
$rast.notFound();
server.json(() => {
    return {"message": "Not Found 🙁"};
});
```

