API test

POST
URL: http://localhost:3001/graphql
{
  "query": "mutation { register(registerDto: { name: \"John Doe\", email: \"john.doe@example.com\", password: \"password123\", phone_number: 1234567890, address: \"123 Main St, Anytown, USA\" }) { user { id, name, email }, error { message, code } } }"
}


//graphql playground
mutation {
  register(registerDto: {
    name: "John Doe",
    email: "baosd159@gmail.com",
    password: "password123",
    phone_number: 13489431654,
    address: "123 Main St, Anytown, USA"
  }) {
	activation_token
}
}

activateUser

mutation {
  activateUser(activateDto: {
    ActivationToken: ""
    ActivationCode: ""
  }) {
    user{
      name
      email
      password
    }
}
}

Login User Mutation:

Method: POST
URL: http://localhost:3001/graphql

{
  "query": "mutation { login(loginDto: { email: \"john.doe@example.com\", password: \"password123\" }) { user { id, name, email }, error { message, code } } }"
}

mutation{
  Login(
    user: "",
    password: ""
  ) {
    user{
      id
      name
      email
      password
      address
    }
    accessToken
    refreshToken
    error {
      message
    }
  }
}

Get Users Query:

{
  "query": "{ users { id, name, email, role, createdAt, updatedAt } }"
}


query{
  getLoggedInUser{
    user{
      id
      name
      email
      address
      password
    }
    accessToken
    refreshToken
  }
}


