import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "GT-Eesti-Regular, GT-Eesti-Medium", // Use your custom font
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true, // Disable ripple effect globally
      },
    },
  },
});

export default theme;
