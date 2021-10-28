import { Container, Row, Col, ListGroup, Form, FormControl } from 'react-bootstrap'
import { FormEvent, useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import User from '../interfaces/User'

// 1) REFRESHING THE PAGE CONNECTS MY CLIENT TO THE SERVER
// 2) IF THE CONNECTION ESTABLISHES CORRECTLY, THE SERVER WILL SEND ME A 'CONNECT' EVENT
// 3) WHEN WE ARE CORRECTLY CONNECTED, WE CAN SEND OUR USERNAME EMITTING AN EVENT OF TYPE 'SETUSERNAME'
// 4) IF THE USERNAME IS RECEIVED FROM THE BACKEND, THE CLIENT WILL RECEIVE A 'LOGGEDIN' EVENT
// 5) WHEN WE RECEIVE A LOGGEDIN EVENT, WE UNLOCK THE MESSAGE INPUT FIELD AND RETRIEVE THE OTHER USERS

const ADDRESS = 'http://localhost:3030'
const socket = io(ADDRESS, { transports: ['websocket'] })
// I'm saving the return value of io in order to interact with the established socket

const Home = () => {
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])

  // every time we refresh the page, we're establishing the connection
  // the server sends us back a 'connect' event
  // the first step is to set up an EVENT LISTENER for this 'connect' event

  useEffect(() => {
    // here, in an useEffect just happening once, we're going to set our event listeners
    // let's set up our first event listener, for the 'connect' event
    socket.on('connect', () => {
      // every .on is an event listener
      console.log('Connection established!')
    })

    socket.on('loggedin', () => {
      console.log('The client now is logged in!')
      // now I'm able to send/receive messages
      // now I can disable the username input field, and I can enable the message input field
      setLoggedIn(!loggedIn)
      fetchOnlineUsers()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchOnlineUsers = async () => {
    try {
      let response = await fetch(ADDRESS + '/online-users')
      if (response.ok) {
        //   let { onlineUsers }: { onlineUsers: User[] } = await response.json()
        let data = await response.json()
        console.log(data)
        let onlineUsers: User[] = data.onlineUsers
        setOnlineUsers(onlineUsers)
      }
    } catch (error) {}
  }

  const handleUsernameSubmit = (e: FormEvent) => {
    e.preventDefault()
    // console.log(e)
    // what we want to do now is sending our username to the server
    socket.emit('setUsername', {
      // I want to carry my username with this event
      // the second parameter of .emit is a payload of data
      // it's not mandatory
      username: username,
    })
  }

  const handleMessageSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log(e)
  }

  return (
    <Container fluid className="px-4">
      <Row className="my-3" style={{ height: '95vh' }}>
        <Col md={10} className="d-flex flex-column justify-content-between">
          {/* MAIN MESSAGES AREA */}
          {/* TOP SECTION: USERNAME FIELD */}
          <Form onSubmit={handleUsernameSubmit}>
            <FormControl
              placeholder="Insert your username here"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loggedIn}
            />
          </Form>
          {/* MIDDLE SECTION: CHAT HISTORY */}
          <ListGroup>
            <ListGroup.Item>Hello there!</ListGroup.Item>
            <ListGroup.Item>Hi</ListGroup.Item>
          </ListGroup>
          {/* BOTTOM SECTION: NEW MESSAGE INPUT FIELD */}
          <Form onSubmit={handleMessageSubmit}>
            <FormControl
              placeholder="Send a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!loggedIn}
            />
          </Form>
        </Col>
        <Col md={2} style={{ borderLeft: '2px solid black' }}>
          {/* CONNECTED USERS AREA */}
          <div className="my-3">Connected users:</div>
          <ListGroup>
            <ListGroup.Item>Stefano</ListGroup.Item>
            <ListGroup.Item>Eddy</ListGroup.Item>
            <ListGroup.Item>Istvan</ListGroup.Item>
            <ListGroup.Item>Magda</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  )
}

export default Home
