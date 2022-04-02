import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FolderIcon from "@mui/icons-material/Folder";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import Divider from "@mui/material/Divider";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Utility from "../../utility";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

//--------Customised alerts------------------
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TodoContainerChild() {
  const [value, setValue] = React.useState("recents");
  const [checked, setChecked] = React.useState([0]);
  const [newTodo, setnewTodo] = React.useState("");
  const [openAlert, setAlert] = React.useState(false);
  const [alertMsg, setMsg] = React.useState("");
  const [todos, setTodos] = React.useState([
    { id: "1", title: "Problem solving skills improves", completed: false },
    {
      id: "2",
      title: "Solving min 10 of from data structures",
      completed: false,
    },
    { id: "3", title: "Have to go for market before 9", completed: false },
    { id: "4", title: "Complete all work before 10pm", completed: false },
  ]);
  //-------------utility classes for creation of objects----
  var object = new Utility(todos);
  var ESCAPE_KEY = 27;
  var ENTER_KEY = 13;

  //--------- components updation while first page loads and update in todo list------
  React.useEffect(() => {
    console.log("jhffs");
  }, [todos]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //--------------handling check list -----------
  const handleCheck = (value) => {
    setTodos(object.handleCheck(value));
  };
  //--------toast for alert --------
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert(false);
  };
  //------------Handling Submit--------------
  function handleSubmit(e) {
    var value = newTodo;

    if (e.which === ENTER_KEY) {
      if (value !== "") {
        setTodos(object.handleSubmit(value));
        setMsg("Added to your todo..!");
        setAlert(true);
      }
    }
  }

  //-----------handling text changes while adding new todo
  const handleChangetext = (value) => {
    setnewTodo(value);
  };
  //--------------handling toggle event -----------
  const handleToggle = (value) => () => {
    handleCheck(value.id);
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <section className="Child-container-parent">
      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          {alertMsg}
        </Alert>
      </Snackbar>
      <Typography variant="h1" component="h1" className="Headline" gutterBottom>
        todos <span className="headline-sub">app</span>
      </Typography>
      <div className="input-container-main">
        <input
          type="text"
          className="add-todo-input"
          placeholder="What needs to be done...?"
          onKeyDown={(e) => handleSubmit(e)}
          onChange={(e) => handleChangetext(e.target.value)}
        />
      </div>
      <div className="List-items-parent">
        <Box
          sx={{
            width: "90%",
            height: 300,
            backgroundColor: "inherit",
          }}
        >
          <div className="list-items-child">
            <List
              sx={{
                width: "inherit",
                maxWidth: "auto",
                bgcolor: "inherit",
              }}
            >
              {todos.map((value) => {
                const labelId = `checkbox-list-label-${value.id}`;

                return (
                  <>
                    <ListItem
                      className="List-items"
                      sx={{
                        backgroundColor: "white",
                        marginTop: "10px",
                      }}
                      key={value}
                      //   onClick={() => handleCheck(value.id)}
                      secondaryAction={
                        <div>
                          <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? "long-menu" : undefined}
                            aria-expanded={open ? "true" : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            id="long-menu"
                            MenuListProps={{
                              "aria-labelledby": "long-button",
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                          >
                            <MenuItem onClick={handleClose}>
                              <ListItemIcon>
                                <ModeEditIcon fontSize="small" />
                              </ListItemIcon>
                              Edit
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                              <ListItemIcon>
                                <DeleteIcon fontSize="small" />
                              </ListItemIcon>
                              Delete
                            </MenuItem>
                          </Menu>
                        </div>
                      }
                      disablePadding
                    >
                      <ListItemButton
                        role={undefined}
                        className={
                          value.completed ? "item-checked" : "item-unchecked"
                        }
                        onClick={handleToggle(value)}
                        dense
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={value.completed}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          id={labelId}
                          primary={value.title}
                          primaryTypographyProps={{
                            fontSize: "17px",
                            fontFamily: "cursive",
                            fontWeight: "600",
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </>
                );
              })}
            </List>
          </div>
          <div className="Bottom-nav">
            <div className="show-case">1 item left</div>
            <BottomNavigation
              sx={{ width: 200, marginLeft: "2em" }}
              value={value}
              onChange={handleChange}
            >
              <BottomNavigationAction
                label="Favorites"
                value="favorites"
                className="padding"
                icon={<FavoriteIcon />}
              />
              <BottomNavigationAction
                label="Nearby"
                value="nearby"
                className="padding"
                icon={<LocationOnIcon />}
              />
              <BottomNavigationAction
                label="Folder"
                value="folder"
                className="padding"
                icon={<FolderIcon />}
              />
            </BottomNavigation>
            <div className="show-case">Clear completed</div>
          </div>
        </Box>
      </div>
    </section>
  );
}

export default TodoContainerChild;
