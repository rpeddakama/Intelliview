import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "GT-Eesti-Regular, GT-Eesti-Medium", // Use your custom font
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true, // Disable ripple effect for all buttons
      },
    },
  },
});

export default theme;
