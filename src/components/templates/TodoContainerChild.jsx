import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import List from "@mui/material/List";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ListItem from "@mui/material/ListItem";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import { useMutation } from "@apollo/client";
import MenuItem from "@mui/material/MenuItem";
import Utility from "../../utility";
import TaskIcon from "@mui/icons-material/Task";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  add_todo,
  get_todos,
  toggle_complete,
  update_title,
  delete_todo,
  delete_completed,
} from "../Query";

//--------Customised alerts------------------
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function sectionedArray(Todos, currentSection) {
  if (currentSection === "All todo") {
    return Todos;
  } else if (currentSection === "Active") {
    return Todos.filter((val) => {
      return val.completed !== true;
    });
  } else {
    return Todos.filter((val) => {
      return val.completed === true;
    });
  }
}

function showClearfun(Todos) {
  var arr = Todos.map((val) => {
    return val.completed !== true;
  });
  console.log(arr);
  return arr.length > 0 ? "Clear completed" : "";
}

function TodoContainerChild({ Todos }) {
  const [value, setValue] = React.useState("All todo");
  const inputref = React.useRef([]);
  const [checked, setChecked] = React.useState([0]);
  const [newTodo, setnewTodo] = React.useState("");
  const [openAlert, setAlert] = React.useState(false);
  const [alertMsg, setMsg] = React.useState("");
  const [edit, setEdit] = React.useState(false);
  const [currentKey, setKey] = React.useState(0);
  const [editId, setEditID] = React.useState(-1);
  const [editedTxt, setEditTxt] = React.useState("");
  const [todos, setTodos] = React.useState(() => sectionedArray(Todos, value));
  const [pendingTodos, setPendingTodos] = React.useState(0);
  const [showClear, setShowClear] = React.useState(() => showClearfun(Todos));

  const [addTodo, { data, loading, error }] = useMutation(add_todo, {
    refetchQueries: [
      get_todos, // DocumentNode object parsed with gql
      add_todo, // Query name
    ],
  });
  const [toggleTodo, { toggle, toggleloading, toggleerror }] =
    useMutation(toggle_complete);

  //------updating title on edit
  const [updateTitle] = useMutation(update_title);

  // ---------delting selected task-------
  const [del_todo] = useMutation(delete_todo);

  // --------deleting all completed task----------

  const [del_all_task] = useMutation(delete_completed);
  //-------------utility classes for creation of objects----
  var object = new Utility(todos);
  var ESCAPE_KEY = 27;
  var ENTER_KEY = 13;

  //--------- components updation while first page loads and update in todo list------
  React.useEffect(() => {
    console.log("jhffs");
    setTodos(sectionedArray(Todos, value));
    handlePendingTodo();
    setShowClear(showClearfun(Todos));
  }, [Todos, value]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, id) => {
    setEditID(id);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setEditID(-1);
    setEdit(false);
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEdit(true);
    setAnchorEl(null);
  };
  const handleDelete = () => {
    console.log(editId);
    del_todo({
      variables: { id: editId },
      optimisticResponse: true,
      update: (cache, { data }) => {
        const existingTodos = cache.readQuery({ query: get_todos });
        const todos = existingTodos.Todo_list.filter((t) => t.id !== editId);
        cache.writeQuery({
          query: get_todos,
          data: { Todo_list: todos },
        });
      },
    });
    setAnchorEl(null);
    handleClose();
  };

  //---------getting all refs of inputs-------------
  inputref.current = [];
  const callrefs = (e) => {
    if (e && !inputref.current.includes(e)) {
      inputref.current.push(e);
    }
  };
  //--------------handling check list -----------
  const handleCheck = (value, toggle) => {
    var is_completed = !toggle;

    //-----updating cache which changes in todo_list--------
    toggleTodo({
      variables: { id: value, completed: is_completed },
      optimisticResponse: true,
      update: (cache) => {
        const existingTodos = cache.readQuery({ query: get_todos });
        const newTodos = existingTodos.Todo_list.map((t) => {
          if (t.id === value) {
            return { ...t, completed: is_completed };
          } else {
            return t;
          }
        });
        cache.writeQuery({
          query: get_todos,
          data: { Todo_list: newTodos },
        });
      },
    });
    // setTodos(object.handleCheck(value));
  };

  // --------handleKeyDownedit---------
  const handleKeydownEdit = (event, val) => {
    if (event.which === ESCAPE_KEY) {
      setEdit(false);
      setEditID(null);
      setEditTxt("");
    } else if (event.which === ENTER_KEY) {
      handleEditSubmit(event, val);
    }
  };

  //------handling edit submit--------
  const handleEditSubmit = (e, value) => {
    if (value !== "") {
      // setTodos(object.handleSubmitEdit(e, value));
      updateTitle({
        variables: { id: value, title: e.target.value },
        optimisticResponse: true,
        update: (cache) => {
          const existingTodos = cache.readQuery({ query: get_todos });
          const newTodos = existingTodos.Todo_list.map((t) => {
            if (t.id === value) {
              return { ...t, title: e.target.value };
            } else {
              return t;
            }
          });
          cache.writeQuery({
            query: get_todos,
            data: { Todo_list: newTodos },
          });
        },
      });
      setAlert(true);
      setMsg("Successfully edited...!");
      setEdit(false);
      setEditID(null);
      setEditTxt("");
    }
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
        addTodo({
          variables: { title: newTodo },
          optimisticResponse: true,
        });

        setTodos(object.handleSubmit(value));
        setMsg("Added to your todo..!");
        setAlert(true);
      }
      setnewTodo("");
    }
  }
  //-------current active todo---------
  const handlePendingTodo = () => {
    var count = 0;
    Todos.forEach((e) => {
      if (!e.completed) count++;
    });
    setPendingTodos(count);
  };

  //-----------handling text changes while adding new todo
  const handleChangetext = (value) => {
    setnewTodo(value);
  };

  // --------clearing all completed task------------
  const handleClearComplete = () => {
    del_all_task({
      optimisticResponse: true,
      update: (cache) => {
        const existingTodos = cache.readQuery({ query: get_todos });
        const newTodos = existingTodos.Todo_list.filter(
          (val) => !val.completed
        );
        console.log(newTodos);
        cache.writeQuery({
          query: get_todos,
          data: { Todo_list: newTodos },
        });
      },
    });
  };

  //--------------handling toggle event -----------
  const handleToggle = (value) => () => {
    handleCheck(value.id, value.completed);
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
          value={newTodo}
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
            minHeight: 250,
            height: "auto",
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
              {todos.map((value, key) => {
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
                      secondaryAction={
                        <div className="more-options">
                          <IconButton
                            aria-label="more"
                            style={{ background: "none" }}
                            id="long-button"
                            aria-controls={open ? "long-menu" : undefined}
                            aria-expanded={open ? "true" : undefined}
                            aria-haspopup="true"
                            onClick={(e) => handleClick(e, value.id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            id="basic-menu"
                            MenuListProps={{
                              "aria-labelledby": "basic-button",
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                          >
                            <MenuItem onClick={handleEdit}>
                              <ListItemIcon>
                                <ModeEditIcon fontSize="small" />
                              </ListItemIcon>
                              Edit
                            </MenuItem>
                            <MenuItem onClick={handleDelete}>
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
                      <input
                        key={value}
                        id={value.id}
                        ref={callrefs}
                        type="text"
                        onChange={(e) => setEditTxt(e.target.value, value.id)}
                        onKeyDown={(e) => handleKeydownEdit(e, value.id)}
                        onBlur={(e) => {
                          setEdit(false);
                          setEditID(null);
                          setEditTxt("");
                        }}
                        placeholder="Edit over here.....!"
                        className={
                          editId === value.id && edit === true
                            ? "edit-todo-visible"
                            : "edit-todo-notvisible"
                        }
                      />

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
                            height: "auto",
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </>
                );
              })}
            </List>
          </div>
          {(() => {
            if (Todos.length > 0) {
              return (
                <div className="Bottom-nav">
                  <div className="show-case">
                    {pendingTodos}&nbsp;
                    <span className="item-left">item&nbsp;</span>
                    left
                  </div>
                  <BottomNavigation
                    sx={{ width: 200, marginLeft: "2em" }}
                    value={value}
                    onChange={handleChange}
                  >
                    <BottomNavigationAction
                      label="All todo"
                      value="All todo"
                      className="padding"
                      defaultChecked
                      icon={<ListAltIcon />}
                    />
                    <BottomNavigationAction
                      label="Active"
                      value="Active"
                      className="padding"
                      icon={<PlaylistAddIcon />}
                    />
                    <BottomNavigationAction
                      label="Completed"
                      value="Completed"
                      className="padding"
                      icon={<TaskIcon />}
                    />
                  </BottomNavigation>
                  <div
                    className="show-case last-case"
                    onClick={handleClearComplete}
                  >
                    {showClear}
                  </div>
                </div>
              );
            }
            return <></>;
          })()}
        </Box>
      </div>
      <Typography className="typo upper">⏎ Press enter to add todo</Typography>
      <Typography className="typo">
        ⌘ Focus on editable input to edit
      </Typography>
    </section>
  );
}

export default TodoContainerChild;
