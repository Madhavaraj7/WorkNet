import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Header from "../components/Header";
import { Avatar, Button, TextField } from "@mui/material";
import Admin from "../assets/Images/UserPlaceHolder.jpg";
import VerifiedIcon from "@mui/icons-material/Verified";
import SendIcon from "@mui/icons-material/Send";
import { io, Socket } from "socket.io-client";
import { NewMessageResContext } from "../ContextAPI/NewMessageArrivedResp";
import Footer from "../components/Footer";

const socket: Socket = io("http://localhost:3000");

interface Message {
  _id: string;
  from: string;
  to: string;
  message: string;
  time: string;
  roomId: string;
}

const Help: React.FC = () => {
  const { setNewMessageArrivedResp } = useContext(NewMessageResContext) || {};
  const [userId, setUserId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);

  const scrollToBottom = () => {
    messageContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const admin = "66bb2bd548e166a70bce4c66";

  const handleUserMessageSend = () => {
    if (message.trim()) {
      const timeStamp = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newMessage: Message = {
        from: userId,
        to: admin,
        message,
        time: timeStamp,
        _id: Date.now().toString(), // Temporary ID for instant display
        roomId: "", // Adjust this if needed
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
      socket.emit("userMessage", newMessage, false);
      scrollToBottom();
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user._id || "");
      setUserProfileImage(user.profileImage || null); // Fetch profile image from localStorage
    } else {
      setUserId(new Date().toString().slice(0, 24).replace(/\s+/g, ""));
    }
  }, []);

  useEffect(() => {
    if (userId) {
      socket.emit("userConnected", userId);
      socket.emit("userSideRoom", userId);

      socket.on("adminMessage", (messages: Message[]) => {
        setMessages(messages);
        setNewMessageArrivedResp?.(messages.length > 0);
        scrollToBottom();
      });

      socket.on("userMessage", (messages: Message[]) => {
        setMessages(messages);
        setNewMessageArrivedResp?.(messages.length > 0);
        scrollToBottom();
      });

      return () => {
        socket.off("adminMessage");
        socket.off("userMessage");
      };
    }
  }, [userId, setNewMessageArrivedResp]);

  return (
    <>
      <Header />
      <br />
      <div className="my-8"></div>

      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div
          className="flex flex-col flex-1 mx-auto mt-8 bg-white shadow-xl rounded-lg"
          style={{ width: "90%", maxWidth: "600px" }}
        >
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
          <div
            className="flex-1 p-4 overflow-auto scrollbar-hide"
            style={{
              maxHeight: "400px",
            }}
          >
            <div className="chat-container space-y-4">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex flex-col mb-2 ${
                      msg.from === userId ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {/* Display User or Admin Avatar */}
                      {msg.from === userId ? (
                        <Avatar
                          src={userProfileImage || Admin}
                          sx={{ width: 32, height: 32 }}
                        />
                      ) : (
                        <Avatar src={Admin} sx={{ width: 32, height: 32 }} />
                      )}

                      {/* Message bubble */}
                      <div
                        className={`p-3 rounded-lg shadow-md ${
                          msg.from === userId
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p>{msg.message}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
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
            {/* Input Field */}
            <TextField
              value={message}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMessage(e.target.value)
              }
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
                  border: "2px solid transparent",
                  background: "rgba(255, 255, 255, 0.5)",
                  backgroundClip: "padding-box, border-box",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                },
              }}
            />

            {/* Send Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleUserMessageSend}
              size="medium"
              endIcon={<SendIcon />}
              style={{
                background: "linear-gradient(90deg, #6366F1 0%, #A855F7 100%)",
                padding: "0.85rem 2rem",
                borderRadius: "50px",
                boxShadow: "0 10px 15px rgba(133, 105, 241, 0.4)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0px 12px 20px rgba(133, 105, 241, 0.8)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 10px 15px rgba(133, 105, 241, 0.4)";
              }}
            >
              Send
            </Button>
          </div>
        </div>

        <br />

        <Footer />
      </div>
    </>
  );
};

export default Help;
