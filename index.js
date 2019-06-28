const express = require("express");

const server = express();

server.use(express.json());

function checkIdParamExists(req, res, next) {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ error: "É necessário informar o ID do projeto na URL" });
  }

  req.projectId = id;
  next();
}

const projects = {};
let requestCount = 0;

function countRequests(req, res, next) {
  next();
  requestCount++;
  console.log(`Request count: ${requestCount}`);
}
server.use(countRequests);

server.post("/projects", (req, res) => {
  const { id } = req.body;
  projects[id] = req.body;
  return res.send();
});

server.get("/projects", (req, res) => {
  return res.json(Object.values(projects));
});

server.put("/projects/:id", checkIdParamExists, (req, res) => {
  const { newTitle } = req.body;

  projects[req.projectId].title = newTitle;
  return res.json(projects[req.projectId]);
});

server.delete("/projects/:id", checkIdParamExists, (req, res) => {
  delete projects[req.projectId];
  return res.send();
});

server.post("/projects/:id/tasks", checkIdParamExists, (req, res) => {
  const { title } = req.body;

  projects[req.projectId].tasks.push(title);
  return res.json(projects[req.projectId]);
});

server.listen(3000);
