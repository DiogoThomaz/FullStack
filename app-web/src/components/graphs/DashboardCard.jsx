import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { ThemeProvider } from '@mui/material/styles';
import theme from "../theme/theme";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Person } from "@mui/icons-material";


// recebe data como um array de objetos
const DashboardCard = ({ cardtitle, data }) => {
  return (
    <Card 
     
    >
      <CardContent>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {cardtitle}
        </Typography>
        <List>
          {data.map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                {item.icone}
              </ListItemIcon>
              <ListItemText primary={item.subtitle} secondary={item.value} />
            </ListItem>
          ))}
        </List>
        
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
