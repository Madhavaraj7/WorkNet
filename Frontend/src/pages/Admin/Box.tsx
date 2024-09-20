import { useEffect, useState, useRef } from "react";
import { Avatar, Button, TextField, Paper, Typography, Box as MuiBox } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import io from "socket.io-client";
import { SERVER_URL } from "../../Services/serverURL";

const socket = io("https://worknet.onrender.com"); // for production
// const socket = io("http://localhost:3000"); // for localhost
// 

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
  onlineUsers: Set<string>; // Prop to keep track of online users
}

function ChatBox({ selectedConversation, onlineUsers }: ChatBoxProps) {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const admin = "66bb2bd548e166a70bce4c66"; // Admin user ID

  useEffect(() => {
    if (selectedConversation && selectedConversation._id) {
      socket.emit('joinRoom', selectedConversation._id);

      const fetchMessages = async () => {
        try {
          const response = await fetch(`${SERVER_URL}/messages/${selectedConversation._id}`);
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
        const response = await fetch(`${SERVER_URL}/message`, {
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
        <MuiBox className="flex items-center">
          <Avatar
            src={selectedConversation?.user.profileImage || "/default-profile.png"}
            sx={{ width: 48, height: 48 }}
          />
          <MuiBox
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: onlineUsers.has(selectedConversation?.user._id || "") ? "green" : "red",
              marginLeft: 1,
              border: '2px solid white',
            }}
          />
        </MuiBox>
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
                    msg.from._id === admin ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                  }`}
                >
                  <Typography variant="body1">{msg.message}</Typography>
                  <Typography variant="caption" className="text-xs">
                    {formatTime(msg.createdAt)}
                  </Typography>
                </Paper>
              </MuiBox>
            </MuiBox>
          ))
        ) : (
          <Typography variant="body1" className="text-center text-gray-500">
            No messages yet
          </Typography>
        )}
        <div ref={messageContainerRef} />
      </MuiBox>

      <MuiBox className="flex items-center p-4 bg-gray-100 border-t border-gray-300">
  <TextField
    fullWidth
    label="Type your message"
    variant="outlined"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        handleAdminMessageSend();
      }
    }}
    multiline
    rows={1}
    className="bg-white rounded-xl shadow-md"
    InputProps={{
      style: {
        padding: "12px 18px",
        borderRadius: "16px",
        backgroundColor: "#f5f5f5",
      },
    }}
  />
  <Button
    variant="contained"
    color="primary"
    onClick={handleAdminMessageSend}
    startIcon={<SendIcon />}
    className="ml-2 rounded-xl shadow-md"
  >
    Send
  </Button>
</MuiBox>

    </Paper>
  );
}

export default ChatBox;
