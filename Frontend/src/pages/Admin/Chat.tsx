import { useEffect, useState } from "react";
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
  Badge,
} from "@mui/material";
import ChatBox from "../Admin/Box";
import io from "socket.io-client";
import { SERVER_URL } from "../../Services/serverURL";

const socket = io("https://worknet.onrender.com"); // Your server URL

interface Room {
  _id: string;
  roomId: string;
  user: { _id: string; username: string; profileImage: string };
  latestMessage: { message: string; createdAt: string }; // latestMessage object
}

function Chat() {
  const [selectedConversation, setSelectedConversation] = useState<Room | null>(null);
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/rooms`);
        const data = await response.json();
        
        const sortedRooms = data.sort((a: Room, b: Room) => {
          const timeA = new Date(a.latestMessage?.createdAt).getTime();
          const timeB = new Date(b.latestMessage?.createdAt).getTime();
          return timeB - timeA; 
        });

        setAllRooms(sortedRooms);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    fetchRooms();

    // Emit when admin is online
    socket.emit("adminOnline");

    // Listen for online status updates from the server
    socket.on("onlineStatus", (users: string[]) => {
      setOnlineUsers(new Set(users));
    });

    // Listen for new messages
    socket.on("newMessage", (newMessage: { roomId: string; message: string; createdAt: string }) => {
      setAllRooms(prevRooms => {
        const roomIndex = prevRooms.findIndex(room => room.roomId === newMessage.roomId);
        if (roomIndex !== -1) {
          // Update the room with the new message
          const updatedRoom = { ...prevRooms[roomIndex], latestMessage: newMessage };
          // Create a new array with the updated room
          const updatedRooms = [
            ...prevRooms.slice(0, roomIndex),
            updatedRoom,
            ...prevRooms.slice(roomIndex + 1)
          ];
          // Sort the rooms based on the latest message timestamp
          return updatedRooms.sort((a: Room, b: Room) => {
            const timeA = new Date(a.latestMessage?.createdAt).getTime();
            const timeB = new Date(b.latestMessage?.createdAt).getTime();
            return timeB - timeA; // Sort in descending order, most recent first
          });
        }
        return prevRooms;
      });
    });

    return () => {
      socket.off("onlineStatus");
      socket.off("newMessage");
    };
  }, []);

  const isUserOnline = (userId: string) => onlineUsers.has(userId);

  return (
    <>
      <br />
      <br />
      <Box display="flex" flexDirection="row" height="100vh">
        {/* Chat Sidebar */}
        <Paper
          className="flex-none w-1/3 bg-gray-100 border-r border-gray-300 shadow-md"
          elevation={3}
          sx={{ display: "flex", flexDirection: "column", height: "100vh" }}
        >
          <Typography
            variant="h6"
            component="div"
            className="bg-gray-200 p-3 text-center font-bold text-lg"
          >
            Inbox
          </Typography>
          <Divider />
          <List sx={{ overflowY: "auto", flex: 1 }}>
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
                    <Badge
                      color={isUserOnline(room.user._id) ? "primary" : "default"}
                      variant="dot"
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    >
                      {room.user.profileImage ? (
                        <Avatar src={room.user.profileImage} />
                      ) : (
                        <Avatar>{room.user.username[0]}</Avatar>
                      )}
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={room.user.username || "Unknown User"}
                    secondary={
                      room.latestMessage ? (
                        <>
                          <Typography variant="body2" color="textSecondary">
                            {room.latestMessage.message}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(room.latestMessage.createdAt).toLocaleTimeString()}
                          </Typography>
                        </>
                      ) : (
                        "No messages yet"
                      )
                    }
                  />
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
          sx={{ overflow: "hidden", display: selectedConversation ? "flex" : "none", height: "100vh" }}
        >
          {selectedConversation ? (
            <ChatBox selectedConversation={selectedConversation} onlineUsers={onlineUsers} />
          ) : (
            <Box className="flex-1 flex items-center justify-center" sx={{ overflow: "hidden" }}>
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
