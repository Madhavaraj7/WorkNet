import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

interface OTPVerificationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({ open, onClose, onSubmit, onChange }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Verify OTP</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="otp"
          label="Enter OTP"
          type="text"
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

export default OTPVerificationModal;
