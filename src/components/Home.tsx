import { Container, Row, Col, ListGroup, Form, FormControl } from 'react-bootstrap'
import { FormEvent, useState } from 'react'
import { io } from 'socket.io-client'

const ADDRESS = 'http://localhost:3030'
const socket = io(ADDRESS, { transports: ['websocket'] })
// I'm saving the return value of io in order to interact with the established socket

const Home = () => {
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')

  const handleUsernameSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log(e)
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
            />
          </Form>
          {/* MIDDLE SECTION: CHAT HISTORY */}
          <ListGroup>
            <ListGroup.Item>Hello there!</ListGroup.Item>
            <ListGroup.Item>Hi</ListGroup.Item>
          </ListGroup>
          {/* BOTTOM SECTION: NEW MESSAGE INPUT FIELD */}
          <Form onSubmit={handleMessageSubmit}>
            <FormControl placeholder="Send a message" value={message} onChange={(e) => setMessage(e.target.value)} />
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
