import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

interface EmailInputModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

const EmailInputModal: React.FC<EmailInputModalProps> = ({ open, onClose, onSubmit }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email) {
      return;
    }
    onSubmit(email);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
          onChange={(e) => setEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailInputModal;
