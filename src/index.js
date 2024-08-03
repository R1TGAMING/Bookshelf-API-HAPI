const Hapi = require('@hapi/hapi');
const routes = require("./Routes")

const init = async () => {
  const PORT = 9000;
  
  const server = Hapi.server({
    port : PORT,
    host : 'localhost'
  });

  server.route(routes)
  await server.start()
  
  console.log(`Server running at: ${PORT}`);
}

init()