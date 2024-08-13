// Components
import { extendTheme } from "@chakra-ui/react";
import { CardComponent } from "./components/card";
import { buttonStyles } from "./components/button";
import { textareaStyles } from "./components/textarea";
import { linkStyles } from "./components/link";
import { globalStyles } from "./styles";

export default extendTheme(
  globalStyles, // global styles
  buttonStyles, // button styles
  linkStyles, // link styles
  textareaStyles, // textarea styles
  CardComponent // card component
);
