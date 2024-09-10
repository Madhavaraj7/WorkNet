import React, { useEffect, useState, useRef, useContext } from "react";
import { Avatar, Button, TextField, Paper, Typography, Box as MuiBox } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { io, Socket } from "socket.io-client";
import { NewMessageResContext } from "../../ContextAPI/NewMessageArrivedResp";

const socket: Socket = io("http://localhost:3000");

interface Message {
  _id: string;
  from: string;
  message: string;
  time: string;
  senderName?: string; // Add senderName
  profileImage?: string; // Add profileImage
}

interface Room {
  senderName: ReactNode;
  _id: string;
  roomId: string;
}

interface ChatBoxProps {
  selectedConversation: Room | string;
}

function ChatBox({ selectedConversation }: ChatBoxProps) {
  const { newMessageArrivedResp, setNewMessageArrivedResp } = useContext(
    NewMessageResContext
  ) as {
    newMessageArrivedResp: boolean;
    setNewMessageArrivedResp: (value: boolean) => void;
  };

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messageContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const admin = "66bb2bd548e166a70bce4c66"; // Admin user ID

  const handleAdminMessageSend = () => {
    if (message.trim()) {
      const timeStamp = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const messageData = {
        roomId: (selectedConversation as Room)._id,
        from: admin,
        to: (selectedConversation as Room).roomId,
        message,
        time: timeStamp,
      };

      setMessage("");

      // Emit admin message
      socket.emit("adminMessage", messageData, true); // 'true' indicates the sender is an admin
    }
  };

  useEffect(() => {
    if (typeof selectedConversation === "object" && selectedConversation._id) {
      socket.emit("adminSideRoom", selectedConversation._id);

      socket.on("adminMessage", (newMessages: Message[]) => {
        setMessages(newMessages);
        setNewMessageArrivedResp(newMessages.length > messages.length);
        scrollToBottom();
      });

      return () => {
        socket.off("adminMessage");
      };
    }
  }, [selectedConversation, messages]);

  return (
    <Paper className="flex flex-col h-[80vh] border border-gray-300 rounded-lg shadow-lg">
      {/* Chat Header */}
      <MuiBox className="bg-gray-800 h-16 flex items-center justify-between px-4 text-white">
        <Typography variant="h6">
          {typeof selectedConversation === "object" ? selectedConversation.senderName : "Chat Room"}
        </Typography>
        <Avatar src={selectedConversation.profileImage} />
        </MuiBox>

      {/* Chat Messages */}
      <MuiBox
        className="flex-1 p-4 overflow-auto space-y-3 bg-gray-50"
        style={{ scrollbarWidth: "none", overflowY: "auto" }}
      >
        {messages.map((msg) => (
          <MuiBox
            key={msg._id}
            className={`flex ${msg.from === admin ? "justify-end" : "justify-start"}`}
          >
            <MuiBox className="flex items-start space-x-2">
              {msg.from !== admin && msg.profileImage && (
                <Avatar src={msg.profileImage} />
              )}
              <Paper
                className={`p-3 rounded-lg shadow-md ${
                  msg.from === admin ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"
                }`}
                style={{
                  borderRadius: "15px",
                  borderBottomRightRadius: msg.from === admin ? "0px" : "15px",
                  borderBottomLeftRadius: msg.from === admin ? "15px" : "0px",
                }}
              >
                {msg.from !== admin && (
                  <Typography variant="subtitle2" className="font-semibold">
                    {/* {msg.senderName || "Unknown User"} */}
                  </Typography>
                )}
                <Typography variant="body2">{msg.message}</Typography>
                <Typography variant="caption" className="text-right mt-1">
                  {msg.time}
                </Typography>
              </Paper>
            </MuiBox>
          </MuiBox>
        ))}
        <div ref={messageContainerRef} />
      </MuiBox>

      {/* Chat Input */}
      <MuiBox className="p-4 bg-gray-100 flex space-x-4 items-center border-t border-gray-300">
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
        >
          <SendIcon />
        </Button>
      </MuiBox>
    </Paper>
  );
}

export default ChatBox;
