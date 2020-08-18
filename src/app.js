const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const loglabel = `[${method.toUpperCase()}] ${url}`;

  console.log(loglabel);

  return next();
}

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid Repository ID." });
  }
  return next();
}

app.use(logRequests);
app.use("/repositories/:id", validateRepositoryId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const id = request.params.id;

  const index = repositories.findIndex((data) => data.id == id);
  if (index < 0) {
    return response.status(400).json({ error: "ID inválido ou inexistente" });
  }

  toUpdate = repositories[index];
  const newData = { id, title, url, techs, likes: toUpdate.likes };
  repositories[index] = newData;

  return response.json(newData);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found!" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const reposIndex = repositories.findIndex((repo) => repo.id === id);
  const giveLikes = repositories[reposIndex];

  giveLikes.likes++;

  return response.json(giveLikes);
});

module.exports = app;
