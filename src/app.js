const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


app.get("/repositories", (request, response) => {
  return response.json(repositories);
});


app.post("/repositories", (request, response) => {
  
  const { title, url, techs} = request.body;
  const repository = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes:0,
  };
  repositories.push(repository);  //o push vai adicionar o repository no array de repositories
  return response.json(repository);
});


app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;
  
    const repositoryIndex = repositories.findIndex(repository => repository.id == id); //encontra a posição do index
    if (repositoryIndex == -1) {
      response.status(400).json({Error: "Repository does not exists!"});
    }
    
    const repository = {
      id,
      title,
      url,
      techs,
      likes: repositories[repositoryIndex].likes, //pega o n. likes de antes de atualizar os repositories
    };
    repositories[repositoryIndex] = repository;
    return response.json(repository);
  });    
       //A parte comentada é outra forma de se fazer o update
    /*  let repository = repositories.find( repository => repository.id === id )
   if (!repository) {
        return response.status(400).json({ error: "Repository not found." })
    }  
      repository = {
      ...repository,
      title,
      url,
      techs,
     }
     return response.json(repository);
    });
    */

  
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id); //encontra a posição do index

  if(repositoryIndex < 0) {
    return response.status(400).json({Error: "Repository not found"});
  }
  repositories.splice(repositoryIndex, 1); //splice deleta o repository no array de repositories
  return response.status(204).send();
});


app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id); //encontra a posição do index

  if(repositoryIndex == -1) {  //se não existir o repository
  return response.status(400).json({ error:"Repository not found"});
 }
  //caso exista o repository procurado
  repositories[repositoryIndex].likes +=1; //adiciona mais 1 like
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
