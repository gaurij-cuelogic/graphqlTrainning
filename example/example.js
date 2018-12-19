var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');

//graphql schema
var schema = buildSchema(`
   type Query{
      message: String
    }
`);

var root = {
    message: () => 'hello world'
};

//create an express server and a graphql endpoint

var app = express();
app.use('/graphql',express_graphql({
    schema: schema,
    rootValue: root,
    graphiql:true
}))

app.listen(3000, () => console.log('express graphql server on localhost 3000/graphql'))
