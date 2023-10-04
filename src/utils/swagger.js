const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'ContractnSign',
        version: '1.0.0',
      },
      components:{
        securitySchemas:{
            bearerAuth:{
                type:'http',
                scheme:'bearer',
                bearerFormat:'JWT'
            }
        }
      },
      security:[
        {
            bearerAuth:[]
        }
      ]
    },
    apis: ['./src/routes/*.js','./src/Schema/*.js'], // files containing annotations as above
  };
  

const swaggerSpecs = swaggerJsDoc(options);

const swaggerDocs = (app, port) => {
  app.use("/swagger-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpecs);
  });

  console.log(`Swagger Docs available at http://localhost:${port}/swagger-docs`)
};

module.exports = swaggerDocs
