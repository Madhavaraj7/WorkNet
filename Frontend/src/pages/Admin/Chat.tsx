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
import { toast } from "react-toastify";
import ChatBox from "../Admin/Box"; // Ensure the correct path

interface Room {
  _id: string;
  roomId: string;
  user: { _id: string, username: string; profileImage: string }; // Adjust to match backend data
}

function Chat() {
  const [selectedConversation, setSelectedConversation] = useState<Room | null>(null);
  const [allRooms, setAllRooms] = useState<Room[]>([]);

  // Fetch all rooms when component mounts
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/rooms");
        const data = await response.json();
        
        setAllRooms(data);
        // Automatically select the first room
        if (data.length > 0) {
          setSelectedConversation(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  // const handleRoomDelete = async (id: string) => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/api/users/rooms/${_id}`, {
  //       method: "DELETE",
  //     });

  //     if (response.ok) {
  //       setAllRooms(allRooms.filter((room) => room._id !== id));
  //       if (selectedConversation && selectedConversation._id === id) {
  //         setSelectedConversation(null);
  //       }
  //       toast.success("Room deleted successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Failed to delete room:", error);
  //   }
  // };

  return (
    <div className="flex w-full max-w-screen-lg">
      {/* Chat Sidebar */}
      <Paper className="flex-none w-1/3 border-r border-gray-300 bg-white shadow-md" elevation={3}>
        <Typography variant="h6" component="div" className="bg-gray-300 p-2 text-center">
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
                  {room.user && <Avatar src={room.user.profileImage} />}
                </ListItemAvatar>
                <ListItemText primary={room.user.username || "Unknown User"} />
                {/* <IconButton edge="end" aria-label="delete" onClick={() => handleRoomDelete(room._id)}>
                  <DeleteIcon />
                </IconButton> */}
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" component="div" className="p-4 text-center">
              No Rooms Found
            </Typography>
          )}
        </List>
      </Paper>

      {/* Chat Box */}
      <div className="flex-1 flex flex-col">
        <ChatBox selectedConversation={selectedConversation} />
      </div>
    </div>
  );
}

export default Chat;
