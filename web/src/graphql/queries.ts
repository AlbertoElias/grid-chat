import { gql } from '@apollo/client'

export const GET_USER = gql`
  query userByUsername ($username: String!) {
    userByUsername (username: $username) {
      username
      id
      chats {
        id
        content
        createdAt
      }
    }
  }
`

export const ADD_USER = gql`
  mutation addUser ($username: String!) {
    addUser (username: $username) {
      username
      id
    }
  }
`

export const GET_CHATS = gql`
  query chats {
    chats {
      id
      createdAt
      content
      author {
        username
        id
      }
    }
  }
`

export const ADD_CHAT = gql`
  mutation addChat ($content: String!, $author: String!, $id: String!) {
    addChat (content: $content, author: $author, id: $id) {
      id
      createdAt
      content
      author {
        username
        id
      }
    }
  }
`

export const CHAT_ADDED = gql`
  subscription chatAdded {
    chatAdded {
      id
      createdAt
      content
      author {
        username
        id
      }
    }
  }
`