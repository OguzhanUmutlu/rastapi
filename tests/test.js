require("../rastapi");

const server = new $rast.httpServer();

$rast.get("/");
server.json(() => {
    return {"message": "Hello World ✨"};
});

$rast.get("/test");
server.file(() => "./tests/api.json");

$rast.get("/test/:test");
server.json((res, vars) => {
    return {"message": "Hello World ✨ " + vars.test};
});

$rast.notFound();
server.json(() => {
    return {"message": "Not Found 🙁"};
});

server.listen().then(() => console.log("I am listening ✨"));