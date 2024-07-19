API test

POST
URL: http://localhost:3001/graphql
{
  "query": "mutation { register(registerDto: { name: \"John Doe\", email: \"john.doe@example.com\", password: \"password123\" }) { user { id, name, email }, error { message, code } } }"
}


Login User Mutation:

Method: POST
URL: http://localhost:3001/graphql

{
  "query": "mutation { login(loginDto: { email: \"john.doe@example.com\", password: \"password123\" }) { user { id, name, email }, error { message, code } } }"
}

Get Users Query:

{
  "query": "{ users { id, name, email, role, createdAt, updatedAt } }"
}



