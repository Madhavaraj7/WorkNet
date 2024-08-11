import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

interface ResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ open, onClose, onSubmit, onChange }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="newPassword"
          label="New Password"
          type="password"
          fullWidth
          variant="standard"
          onChange={onChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordModal;
