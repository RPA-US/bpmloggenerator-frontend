import ChevronLeft from "@mui/icons-material/ChevronLeft";
import { IconButton } from "@mui/material";
import { useHistory } from "react-router-dom";

export interface BackButtonProps {
  to?: string
}

const BackButton: React.FC<BackButtonProps> = ({ to }) => {
  const history = useHistory();
  // history must be greater than 2 because on application init we have a redirect on App entry file
  // 1st -> / -> App.tsx
  // 2nd -> /**/* -> TargetPage.tsx
  return (to != null || history.length > 2) ? (
    <IconButton color="primary" aria-label="go back" component="span" onClick={ () => to != null ? history.push(to) : history.goBack() }>
      <ChevronLeft />
    </IconButton>
  ) : (<></>);
}

export default BackButton;