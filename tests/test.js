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

$rast.Icon.createFromURL("https://i1.sndcdn.com/avatars-000389897325-h3s225-t500x500.jpg")
    .then(img => server.setIcon(img))
    .catch(err => console.error(err));
server.listen().then(() => console.log("I am listening ✨"));