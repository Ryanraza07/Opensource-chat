import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import server from './environment'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Container,
  Button,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'

const SERVER_URL = server

function initials(name) {
  if (!name) return '?' 
  return name.split(' ').map(n => n[0].toUpperCase()).slice(0,2).join('')
}

export default function VideoMeetComponent() {
  const socketRef = useRef(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState('')
  const [askForUsername, setAskForUsername] = useState(true)
  const [typingUsers, setTypingUsers] = useState([])
  const messagesEndRef = useRef(null)
  const typingTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [])

  const addMessage = (data, sender) => {
    setMessages(prev => [...prev, { sender, data }])
    setTypingUsers(prev => prev.filter(n => n !== sender))
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const connect = () => {
    if (socketRef.current) return
    socketRef.current = io(SERVER_URL)
    const room = window.location.pathname
    socketRef.current.emit('join-call', room)
    socketRef.current.on('chat-message', addMessage)
    socketRef.current.on('typing', (senderName) => {
      if (!senderName) return
      setTypingUsers(prev => prev.includes(senderName) ? prev : [...prev, senderName])
    })
    socketRef.current.on('stop-typing', (senderName) => {
      if (!senderName) return
      setTypingUsers(prev => prev.filter(n => n !== senderName))
    })
    setAskForUsername(false)
  }

  const handleMessage = (e) => {
    const value = e.target.value
    setMessage(value)
    if (!socketRef.current) return
    if (!username) return

    socketRef.current.emit('typing', username)
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => {
      if (socketRef.current) socketRef.current.emit('stop-typing', username)
    }, 1000)
  }

  const sendMessage = () => {
    if (socketRef.current && message.trim()) {
      socketRef.current.emit('chat-message', message, username)
      if (socketRef.current && username) socketRef.current.emit('stop-typing', username)
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current)
        typingTimerRef.current = null
      }
      setMessage('')
    }
  }

  const roomLabel = window.location.pathname.replace('/', '') || 'Lobby'

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
      <div className="playful-shape shape-1" />
      <div className="playful-shape shape-2" />
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar sx={{ gap: 2 }}>
          <ChatBubbleIcon />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MeetNow Chat
          </Typography>
          <Typography sx={{ opacity: 0.9 }}>{roomLabel}</Typography>
        </Toolbar>
      </AppBar>

      <Container className="chat-root" maxWidth="sm">
        <Paper elevation={3} sx={{ mt: 4, p: 2, borderRadius: 3 }}>
          {askForUsername ? (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField label="Your name" value={username} onChange={e => setUsername(e.target.value)} fullWidth />
              <Button variant="contained" onClick={connect} disabled={!username}>
                Join
              </Button>
            </Box>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{initials(username)}</Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{username}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{roomLabel}</Typography>
                </Box>
              </Box>

              <Paper variant="outlined" sx={{ height: 420, overflowY: 'auto', p: 1, mb: 1 }}>
                <List>
                  {messages.length === 0 && (
                    <ListItem>
                      <ListItemText primary="No messages yet — say hello 👋" />
                    </ListItem>
                  )}
                  {messages.map((m, i) => (
                    <ListItem key={i} sx={{ justifyContent: m.sender === username ? 'flex-end' : 'flex-start' }}>
                      {m.sender !== username && (
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'secondary.main' }}>{initials(m.sender)}</Avatar>
                        </ListItemAvatar>
                      )}

                      <Box className={m.sender === username ? 'bubble me' : 'bubble other'}>
                        <Typography variant="body1" sx={{ lineHeight: 1.4 }}>{m.data}</Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.8 }}>{m.sender}</Typography>
                      </Box>

                      {m.sender === username && (
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>{initials(m.sender)}</Avatar>
                        </ListItemAvatar>
                      )}
                    </ListItem>
                  ))}
                </List>
                <div ref={messagesEndRef} />
              </Paper>

              {typingUsers.length > 0 && (
                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1 }}>
                  {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </Typography>
              )}

              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  value={message}
                  onChange={handleMessage}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Write a message... (Shift+Enter for new line)"
                  multiline
                  maxRows={4}
                  fullWidth
                />
                <IconButton color="primary" onClick={sendMessage} size="large">
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  )
}
