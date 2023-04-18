import { Paper } from '@mui/material';
import styles from './container.module.css';

function MyPaper(props) {
  return (
    <Paper elevation={3} square >
      <div>
        <h3>{props.titulo}</h3>
        <hr />
      </div>
      <div>
        {props.children}
      </div>
    </Paper>
  );
}

export default MyPaper;