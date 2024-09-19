import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Avatar, Button, TextField } from "@mui/material";
import Admin from "../assets/Images/UserPlaceHolder.jpg";
import VerifiedIcon from "@mui/icons-material/Verified";
import SendIcon from "@mui/icons-material/Send";
import Footer from "../components/Footer";
import { SERVER_URL } from "../Services/serverURL";
import io, { Socket } from "socket.io-client";
import Header from "../components/Header";

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

const Help: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);

  const admin = "66bb2bd548e166a70bce4c66"; // Admin ID

  useEffect(() => {
    const socketConnection = io("https://worknet.onrender.com", {
      transports: ["websocket"],
      autoConnect: false,
    });

  // useEffect(() => {
  //   const socketConnection = io("http://localhost:3000", {
  //     transports: ["websocket"],
  //     autoConnect: false,
  //   });


    socketConnection.connect();
    setSocket(socketConnection);

    // Emit user online status when user connects
    socketConnection.emit("userOnline", userId);

    return () => {
      if (socketConnection) {
        // Emit user offline status when user disconnects
        socketConnection.emit("userOffline", userId);
        socketConnection.disconnect();
      }
    };
  }, [userId]);

  useEffect(() => {
    if (socket) {
      socket.on("message", (newMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      socket.on("onlineStatus", (onlineUsers: string[]) => {
        console.log("Online Users:", onlineUsers);
      });

      return () => {
        socket.off("message");
        socket.off("onlineStatus");
      };
    }
  }, [socket]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user._id || "");
      setUserProfileImage(user.profileImage || null);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      createOrFindRoom(); // Create or find the room once the userId is set
    }
  }, [userId]);

  useEffect(() => {
    if (roomId) {
      fetchMessages(); 

      if (socket) {
        socket.emit("joinRoom", roomId);
      }
    }
  }, [roomId, socket]);

  const scrollToBottom = () => {
    messageContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const createOrFindRoom = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/room`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      setRoomId(data.roomId); // Set the room ID once it's created/found
    } catch (error) {
      console.error("Error creating or finding room:", error);
    }
  };

  const fetchMessages = async () => {
    if (roomId) {
      try {
        const response = await fetch(`${SERVER_URL}/messages/${roomId}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.error("Unexpected response format:", data);
          setMessages([]);
        }

        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
  };

  const handleUserMessageSend = async () => {
    if (message.trim()) {
      const newMessage = {
        from: userId,
        to: admin,
        message,
        roomId,
      };

      try {
        const response = await fetch(`${SERVER_URL}/message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMessage),
        });

        const latestMsg = await response.json();

        if (response.ok) {
          setMessage(""); // Clear input after sending
          scrollToBottom();
          if (socket) {
            socket.emit("message", latestMsg); // Emit the message to the server
          }
        } else {
          console.error("Error sending message");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <Header />
      <br />
      <br />

      <div className="my-8"></div>
      <div className="flex flex-col flex-1 mx-auto mt-8 bg-white shadow-xl rounded-lg" style={{ width: "90%", maxWidth: "600px" }}>
        {/* Chat Header */}
        <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center px-4 border-b border-indigo-700 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Avatar src={Admin} sx={{ width: 48, height: 48 }} />
            <p className="text-lg font-semibold flex items-center space-x-1">
              Admin <VerifiedIcon color="inherit" fontSize="small" />
            </p>
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 p-4 overflow-auto scrollbar-hide" style={{ maxHeight: "400px" }}>
          <div className="chat-container space-y-4">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg._id} className={`flex flex-col mb-2 ${msg.from._id === userId ? "items-end" : "items-start"}`}>
                  <div className="flex items-center space-x-2">
                    <Avatar
                      src={msg.from._id === userId ? userProfileImage || Admin : Admin}
                      sx={{ width: 32, height: 32 }}
                    />
                    <div className={`p-3 rounded-lg shadow-md ${msg.from._id === userId ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"}`}>
                      <p>{msg.message}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1"> {formatTime(msg.createdAt)}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No messages yet.</p>
            )}
            <div ref={messageContainerRef}></div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="flex items-center p-4 border-t border-gray-300 bg-gradient-to-r from-white to-gray-50 rounded-b-lg shadow-lg space-x-4 backdrop-blur-lg">
          <TextField
            value={message}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
            variant="outlined"
            placeholder="Type your message..."
            fullWidth
            multiline
            rows={1}
            className="bg-white/40 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500 backdrop-blur-lg"
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
            endIcon={<SendIcon />}
            onClick={handleUserMessageSend}
            className="rounded-xl shadow-md"
          >
            Send
          </Button>
        </div>
      </div>

      <div className="my-8"></div>
      <Footer />
    </>
  );
};

export default Help;
