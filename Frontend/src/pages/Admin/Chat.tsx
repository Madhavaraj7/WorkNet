import React, { useEffect, useState } from "react";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Paper,
  Divider,
  Box,
} from "@mui/material";
import ChatBox from "../Admin/Box"; // Ensure the correct path

interface Room {
  _id: string;
  roomId: string;
  user: { _id: string; username: string; profileImage: string };
}

function Chat() {
  const [selectedConversation, setSelectedConversation] = useState<Room | null>(null);
  const [allRooms, setAllRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/rooms");
        const data = await response.json();
        setAllRooms(data);
        if (data.length > 0) {
          setSelectedConversation(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <>

    <br />
    <br />
    <Box display="flex" flexDirection="row" height="100vh">
      {/* Chat Sidebar */}
      <Paper
        className="flex-none w-1/3 bg-gray-100 border-r border-gray-300 shadow-md"
        elevation={3}
        sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
        <Typography
          variant="h6"
          component="div"
          className="bg-gray-200 p-3 text-center font-bold text-lg"
        >
          Inbox
        </Typography>
        <Divider />
        <List sx={{ overflowY: 'auto', flex: 1 }}>
          {allRooms.length > 0 ? (
            allRooms.map((room) => (
              <ListItem
                key={room._id}
                button
                selected={selectedConversation?._id === room._id}
                onClick={() => setSelectedConversation(room)}
                className="hover:bg-gray-200 transition ease-in-out"
              >
                <ListItemAvatar>
                  {room.user.profileImage ? (
                    <Avatar src={room.user.profileImage} />
                  ) : (
                    <Avatar>{room.user.username[0]}</Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText primary={room.user.username || "Unknown User"} />
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" component="div" className="p-4 text-center text-gray-600">
              No Rooms Found
            </Typography>
          )}
        </List>
      </Paper>

      {/* Chat Box */}
      <Box
        className="flex-1 flex flex-col"
        sx={{ overflow: 'hidden', display: selectedConversation ? 'flex' : 'none', height: '100vh' }}
      >
        {selectedConversation ? (
          <ChatBox selectedConversation={selectedConversation} />
        ) : (
          <Box
            className="flex-1 flex items-center justify-center"
            sx={{ overflow: 'hidden' }}
          >
            <Typography variant="h6" color="textSecondary">
              Select a chat to start messaging
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
    </>
  );
}

export default Chat;
