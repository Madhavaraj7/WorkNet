import React, { useEffect, useState } from "react";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Typography,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import ChatBox from "../Admin/Box"; // Ensure the correct path

const socket: Socket = io("http://localhost:3000");

interface Room {
  _id: string;
  roomId: string;
  senderName: string;
  profileImage: string;
}

function Chat() {
  const [selectedConversation, setSelectedConversation] = useState<Room | null>(null);
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [msgNotification, setMsgNotification] = useState<any[]>([]);

  // Fetch all rooms and select the first one initially
  const getAllRooms = () => {
    socket.emit("adminRoomOpen");
    socket.on("adminRooms", (rooms: Room[]) => {
      setAllRooms(rooms);
      if (rooms.length > 0 && selectedConversation === null) {
        setSelectedConversation(rooms[0]); // Select the first room initially
      }
    });
  };

  useEffect(() => {
    getAllRooms();
    const intervalId = setInterval(() => {
      socket.emit("adminConnected", "admin");
      socket.on("notification", (notification: any) =>
        setMsgNotification(notification)
      );
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  const handleRoomDelete = (id: string) => {
    setAllRooms(allRooms.filter((room) => room._id !== id));
    if (selectedConversation && selectedConversation._id === id) {
      setSelectedConversation(null);
    }
    toast.success("Room deleted successfully!");
  };

  const roomNotification = (roomId: string) => {
    return msgNotification.filter((msg: any) => msg.roomId === roomId).length;
  };

  return (
    <>
      <br />
      <br />

      <div className="flex w-full max-w-screen-lg ">
        {/* Chat Sidebar */}
        <Paper
          className="flex-none w-1/3 border-r border-gray-300 bg-white shadow-md"
          elevation={3}
        >
          <Typography
            variant="h6"
            component="div"
            className="bg-gray-300 p-2 text-center"
          >
            Inbox
          </Typography>
          <List>
            {allRooms.length > 0 ? (
              allRooms.map((room) => (
                <ListItem
                  key={room._id}
                  button
                  selected={selectedConversation?._id === room._id}
                  onClick={() => setSelectedConversation(room)}
                >
                  <ListItemAvatar>
                    <Avatar src={room.profileImage} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={room.senderName}
                    secondary={
                      roomNotification(room._id) > 0
                        ? `${roomNotification(room._id)} new messages`
                        : ""
                    }
                  />
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRoomDelete(room._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))
            ) : (
              <Typography
                variant="body1"
                component="div"
                className="p-4 text-center"
              >
                No Rooms Found
              </Typography>
            )}
          </List>
        </Paper>

        {/* Chat Box */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <ChatBox selectedConversation={selectedConversation} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Typography variant="h6">
                Select a conversation to start chatting
              </Typography>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Chat;
