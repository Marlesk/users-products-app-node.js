const m2s = require('mongoose-to-swagger')
const User = require('./models/user.model')

exports.options = {
  "components": {
    "schemas": {
      User: m2s(User)
    },
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  },

  "security": [
    {"bearerAuth":[]}
  ],

  "openapi": "3.1.0",
  "info": {
    "version": "1.0.0",
    "title": "Users and Products CRUD API",
    "description": "An application for creating users and choosing products",
    "contact": {
      "name": "API Support",
      "url": "https://aueb.gr",
      "email": "support@example.com"
    }

  },

  "servers": [
    {
      "url": "http://localhost:3000",
      "description": "Local server"
    },
    {
      "url": "http://www.backend.aueb.gr",
      "description": "Testing server"
    }
  ],

  "tags": [
    {
      "name": "Users",
      "description": "Endpoints for Users"
    },
    {
      "name": "Users and Products",
      "description": "Endpoints for Users and Products"
    },
    {
      "name": "Auth",
      "description": "Endpoints for Authentication"
    }
  ],

  "paths": {
    "/api/users": {
      "get": {
        "tags": ["Users"],
        "description": "Returns a list of all users",
        "responses": {
          "200": {
            "description": "List of all users",
            "content": {
              "application/json": {
                "schema": {
                "type": "array",
                "items": {"$ref": "#/components/schemas/User"}
                }
              } 
            }
          }
        }
      },

      "post": {
        "tags": ["Users"],
        "description": "Data of users that we want to create",
        "requestBody": {
          "description": "Json with user data",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "username": {"type": "string"},
                  "password": {"type": "string"},
                  "name": {"type": "string"},
                  "surname": {"type": "string"},
                  "email": {"type": "string"},
                  "address": {
                    "type": "object",
                    "properties": {
                      "area": {"type": "string"},
                      "road": {"type": "string"}
                    }
                  }
                },
                "required": ["username", "password", "name","surname", "email"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "JSON of new user"
          }
        }
      }
    },

    "/api/users/{username}": {
      "get": {
        "tags": ["Users"],
        "parameters": [
          {
            "name": "username",
            "in": "path",
            "required":true,
            "description": "Username of user that we want to find",
            "type": "string"
          }
        ],
        "description": "Return users details for specific username",
        "responses": {
          "200": {
            "description": "User details",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          }
        }
      },

      "patch": {
        "tags": ["Users"],
        "description": "Update user",
        "parameters": [
          {
            "name": "username",
            "in": "path",
            "required": true,
            "description": "Username of user that can update",
            "type": "string"
          }
        ],
        "requestBody": {
          "description": "Data of user to update",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "username": {"type": "string"},
                  "name": {"type": "string"},
                  "surname": {"type": "string"},
                  "email": {"type": "string"},
                  "address": {
                    "type": "object",
                    "properties": {
                      "area": {"type": "string"},
                      "road": {"type": "string"},
                    }
                  }
                },
                "required": ["email"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Update user"
          }
        }
      },
      
      "delete": {
        "tags": ["Users"],
        "description": "Delete user for DB",
        "parameters": [
          {
            "name": "username",
            "in": "path",
            "description": "User to delete",
            "type": "string",
            "required": true
          }
        ],
        "responses": {
          "200": {
            "description": "Delete user"
          }
        }
      }
    },

    "/api/users/{username}/{email}/": {
      "delete": {
        "tags": ["Users"],
        "description": "Delete user by username and email for DB"
      },
      "parameters": [
          {
            "name": "username",
            "email": "email",
            "in": "path",
            "description": "The user's username",
            "type": "string",
            "required": true
          },
          {
            "name": "email",
            "in": "path",
            "description": "The user's email",
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Delete user"
          }
        }
    },

    "/api/auth/login": {
      "post": {
        "tags": ["Auth"],
        "description": "Login User",
        "requestBody": {
          "description": "User send username and password and for response we have jwt token",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "username": {"type": "string"},
                  "password": {"type": "string"},
                },
                "required": ["username", "password"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Token returned"
          }
        }  
      }
    },

    "/api/user-product/{username}": {
      "get": {
        "tags": ["Users and Products"],
        "description": "Returns a list of user and products",
        "parameters": [
          {
            "name": "username",
            "in": "path",
            "description": "Find user and products",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "User and Products",
            "schema":{
              "$ref": "#/components/schemas/User"
            }
          }
        } 
      }

      // "patch": {
      //   "tags": ["Users and Products"],
      //   "description": "Update the quantity of a specific product for a user",
      //   "parameters": [
      //     {
      //       "name": "username",
      //       "in": "path",
      //       "description": "Username of user that can update",
      //       "required": true,
      //       "type": "string"
      //     }
      //   ],
      //   "requestBody": {
      //     "description": "Data of user to update products",
      //     "content": {
      //       "application/json": {
      //         "schema": {
      //           "type": "object",
      //           "properties": {
      //             "product": {
      //               "type": "array",
      //               "items": {
      //                 "type": "object",
      //                 "properties": {
      //                   "_id": {"type": "string"},
      //                   "quantity": {"type": "number"}
      //                 }
      //               }
      //             }
      //           },
      //           "required": ["_id", "quantity"]
      //         },
              
      //       }
      //     }
      //   },
      //   "responses": {
      //     "200": {
      //       "description": "Update products"
      //     }
      //   }
      // }
    }
  }
  
}