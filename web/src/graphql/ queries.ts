import { gql } from '@apollo/client'

export const GET_USER = gql`
  query userByUsername ($username: String!) {
    userByUsername (username: $username) {
      username
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
    }
  }
`

export const GET_CHATS = gql`
  query chats {
    chats {
      id
      content
      author {
        username
      }
      createdAt
    }
  }
`