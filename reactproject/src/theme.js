import { extendTheme } from '@chakra-ui/react';

// Bright Theme with Background Image
const brightTheme = extendTheme({
  styles: {
    global: {
      "html, body": {
        bg: "gray.100",
        color: "gray.900",
        fontFamily: "'Roboto', sans-serif",
        backgroundImage: "url('./images/bright2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      },
    },
  },
});

// Dark Theme with Background Image
const darkTheme = extendTheme({
  styles: {
    global: {
      "html, body": {
        bg: "gray.800",
        color: "gray.200",
        fontFamily: "'Roboto', sans-serif",
        backgroundImage: "url('./images/dark1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      },
    },
  },
});

// Modern Theme with Gradient Background
const modernTheme = extendTheme({
  styles: {
    global: {
      "html, body": {
        bgGradient: "linear(to-r, #7928CA, #FF0080)",
        color: "white",
        fontFamily: "'Montserrat', sans-serif",
        backgroundImage: "url('./images/modern1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      },
    },
  },
});

// No Theme (Default Light Theme without Background Image)
const defaultLightTheme = extendTheme({
  styles: {
    global: {
      "html, body": {
        bg: "white", // Light background without any background image
        color: "gray.800",
        fontFamily: "'Roboto', sans-serif",
      },
    },
  },
});

export { brightTheme, darkTheme, modernTheme, defaultLightTheme };