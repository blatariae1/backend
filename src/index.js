const express = require('express');
const { uuid, isUuid } = require('uuidv4');
const app = express();

app.use(express.json());

/**
 * Métodos HTTP:
 * 
 * GET: Buscar Informações do Back_End
 * POST: Criar uma informação no Back_End
 * PUT/PATCH: Alterar uma informação no Back-End
 * DELETE: Deletar uma Informação no Back_End
 */

/**
 * Tipos de Parâmetros:
 * 
 * Query Params: Filtros e Paginação
 * Route Params: Identificar recursos(Atualizar/Deletar)
 * Request Body: Conteúdo na hora de criar ou editar um recurso (JSON)
 */

/**
 * Middleware:
 * interceptador de requisições que pode interromper totalmente a requisição, ou
 * pode alterar dados da requisição
 */

const projects = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.log(logLabel);

  return next();
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'ID Invalido' });
  }

  return next();

}


//app.use(logRequests);

app.get('/projects', logRequests, (request, response) => {
  const { title } = request.query;
  
  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;
  
  return response.json(results);
});

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner }

  projects.push(project);

  return response.json(project);
});

app.put('/projects/:id', validateProjectId, (request, response) => {
  const { id } = request.params;
  const { title, owner} = request.body;

  const projectIndex = projects.findIndex(project => project.id == id);

  if(projectIndex < 0){
    return response.status(400).json({ error: 'Project not Found'});
  }

  const project = {
    id, 
    title,
    owner
  };

  projects[projectIndex] = project;

  return response.json(project);
});

app.delete('/projects/:id', validateProjectId, (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id == id);

  if( projectIndex < 0 ){
    return response.status(400).json({ error: 'Project not Found' })
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
});

app.listen(3333, () => {
  console.log('👍Back-end Started')
});