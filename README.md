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
server.json(res => {
    return {"message": "You are in /test/" + res.getVariables().test};
});
```

### Using url query

```javascript
$rast.get("/test");
server.json(res => {
    return {"message": "You have successfully entered!", "query": res.getQuery()};
});
```

### Not found page

```javascript
$rast.notFound();
server.json(() => {
    return {"message": "Not Found 🙁"};
});
```

### Set icon

```javascript
$rast.Icon.createFromURL("https://i1.sndcdn.com/avatars-000389897325-h3s225-t500x500.jpg")
    .then(img => server.setIcon(img))
    .catch(err => console.error(err));
```

