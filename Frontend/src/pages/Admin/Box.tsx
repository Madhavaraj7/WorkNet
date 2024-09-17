import React, { useEffect, useState, useRef } from "react";
import { Avatar, Button, TextField, Paper, Typography, Box as MuiBox } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Adjust the URL to your server

interface Message {
  _id: string;
  from: {
    _id: string;
    username: string;
    profileImage: string;
  };
  to: {
    username: string;
    profileImage: string;
  };
  message: string;
  createdAt: string;
}

interface Room {
  _id: string;
  roomId: string;
  user: { _id: string; username: string; profileImage: string };
}

interface ChatBoxProps {
  selectedConversation: Room | null;
}

function ChatBox({ selectedConversation }: ChatBoxProps) {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const admin = "66bb2bd548e166a70bce4c66"; // Admin user ID

  useEffect(() => {
    if (selectedConversation && selectedConversation._id) {
      socket.emit('joinRoom', selectedConversation._id);

      const fetchMessages = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/users/messages/${selectedConversation._id}`);
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      };

      fetchMessages();

      socket.on('message', (newMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        socket.off('message');
      };
    }
  }, [selectedConversation]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messageContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAdminMessageSend = async () => {
    if (message.trim() && selectedConversation) {
      const messageData = {
        roomId: selectedConversation._id,
        from: admin,
        to: selectedConversation.user._id,
        message,
      };

      setMessage("");

      try {
        const response = await fetch("http://localhost:3000/api/users/message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        });

        if (response.ok) {
          const newMessage = await response.json();
          socket.emit('message', newMessage);
        } else {
          const errorData = await response.json();
          console.error('Failed to send message:', errorData);
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Paper className="flex flex-col h-full border border-gray-300 rounded-lg shadow-lg">
      <MuiBox className="bg-gray-800 h-16 flex items-center justify-between px-4 text-white">
        <Typography variant="h6">
          {selectedConversation?.user.username || "Chat Room"}
        </Typography>
        <Avatar
          src={selectedConversation?.user.profileImage || "/default-profile.png"}
        />
      </MuiBox>

      <MuiBox
        className="flex-1 p-4 overflow-auto bg-gray-50"
        style={{ scrollbarWidth: "none", overflowY: "auto" }}
      >
        {messages.length > 0 ? (
          messages.map((msg) => (
            <MuiBox
              key={msg._id}
              className={`flex ${msg.from._id !== admin ? "justify-start" : "justify-end"} mb-2`}
            >
              <MuiBox className="flex items-start space-x-2">
                {msg.from.username !== admin && msg.from.profileImage && (
                  <Avatar src={msg.from.profileImage || "/default-profile.png"} />
                )}
                <Paper
                  className={`p-3 rounded-lg shadow-md ${
                    msg.from._id === admin ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"
                  }`}
                  style={{
                    borderRadius: "15px",
                    borderBottomRightRadius: msg.from._id === admin ? "0px" : "15px",
                    borderBottomLeftRadius: msg.from._id === admin ? "15px" : "0px",
                  }}
                >
                  <Typography variant="body2">{msg.message}</Typography>
                  <Typography variant="caption" className="text-right mt-1 text-gray-600">
                    {formatTime(msg.createdAt)}
                  </Typography>
                </Paper>
              </MuiBox>
            </MuiBox>
          ))
        ) : (
          <Typography variant="body1" className="text-center text-gray-600">
            No messages yet
          </Typography>
        )}
        <div ref={messageContainerRef} />
      </MuiBox>

      <MuiBox className="p-4 bg-gray-100 flex items-center border-t border-gray-300">
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          variant="outlined"
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdminMessageSend}
          disabled={!message.trim()}
          className="ml-2"
        >
          <SendIcon />
        </Button>
      </MuiBox>
    </Paper>
  );
}

export default ChatBox;
