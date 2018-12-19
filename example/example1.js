var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');

//graphql schema
var schema = buildSchema(`
   type Query{
      course(id: Int!): Course
      courses(topic: String):[Course]
    }
   
    type Mutation{
     updateCourseTopic(id: Int, topic: String): Course
   }

   type Course{
       id: Int
       title: String
       author: String
       description: String
       topic: String
       url: String
    }
`);

var coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]


var getCourse = function (args) {
    var id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0]
}

var getCourses = function (args) {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic == topic);
    }
    else {
        return coursesData;
    }

}


var updateCourseTopic = function ({ id, topic }) {
    coursesData.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });
    return coursesData.filter(course => course.id === id)[0];
}

var root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
};

//create an express server and a graphql endpoint

var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.listen(3000, () => console.log('express graphql server on localhost 3000/graphql'))


















//=========>query 1
// =====> query
// query getCourses($courseTopic: String!) {
//     courses(topic: $courseTopic) {
//       title
//       description
//       author
//     }
//   }

//=====> query variable1
//{"courseTopic": "Node.js"}

//=====> output1
// {
//     "data": {
//       "courses": [
//         {
//           "title": "The Complete Node.js Developer Course",
//           "description": "Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!",
//           "author": "Andrew Mead, Rob Percival"
//         },
//         {
//           "title": "Node.js, Express & MongoDB Dev to Deployment",
//           "description": "Learn by example building & deploying real-world Node.js applications from absolute scratch",
//           "author": "Brad Traversy"
//         }
//       ]
//     }
//   }







// ============>FRAGMENT
// query getCoursesWithFragments($CourseId1:Int!,$CourseId2:Int!){
//     course1 : course(id:$CourseId1){
//       ...courseFields
//     }
//     course2 : course(id:$CourseId2){
//       ...courseFields
//     }
//   }

//   fragment courseFields on Course{
//     title
//     author
//     description
//     topic
//   }


//   {
//     "CourseId1": 1, 
//     "CourseId2": 2
//   }


//   {
//     "data": {
//       "course1": {
//         "title": "The Complete Node.js Developer Course",
//         "author": "Andrew Mead, Rob Percival",
//         "description": "Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!",
//         "topic": "Node.js"
//       },
//       "course2": {
//         "title": "Node.js, Express & MongoDB Dev to Deployment",
//         "author": "Brad Traversy",
//         "description": "Learn by example building & deploying real-world Node.js applications from absolute scratch",
//         "topic": "Node.js"
//       }
//     }
//   }










//MUTATION
// mutation updateCourseTopic($CourseId:Int!, $Topic:String){
//     updateCourseTopic(id:$CourseId,topic:$Topic){
//     ...courseFields  
//     }
//   }
  
//   fragment courseFields on Course{
//     title
//     author
//     description
//     topic
//   }




//   {
//     "CourseId": 1,
//     "Topic": "some new topic"
//   }




//   {
//     "data": {
//       "updateCourseTopic": {
//         "title": "The Complete Node.js Developer Course",
//         "author": "Andrew Mead, Rob Percival",
//         "description": "Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!",
//         "topic": "some new topic"
//       }
//     }
//   }