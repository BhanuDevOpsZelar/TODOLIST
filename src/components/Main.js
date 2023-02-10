import React from "react";
import { Box, CardHeader, Checkbox } from "@mui/material";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";

const Main = () => {
  const [todoList, setTodoList] = useState([]);
  const [addTask, setTask] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [msg, setMsg] = useState("");
  const addTaskFn = async () => {
    await addDoc(collection(db, "todoList"), {
      Taskname: addTask,
      status: isChecked,
    });
  };

  const updatefn = async (isChecked, id) => {
    const washingtonRef = doc(db, "todoList", id);
    await updateDoc(washingtonRef, {
      status: isChecked,
    });
    setIsChecked(false);
  };
  const getTodoList = async () => {
    const todoListQuery = query(collection(db, "todoList"));
    onSnapshot(todoListQuery, (querySnapshot) => {
      setTodoList(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
  };
  useEffect(() => {
    getTodoList();
    updatefn();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <Box>
        <TextField
          label="Enter task name"
          variant="outlined"
          onChange={(e) => {
            setTask(e.target.value);
            e.preventDefault();
          }}
        />

        <Box sx={{ mt: 1 }}>
          <Button
            variant="contained"
            disabled={!addTask > 0 ? true : false}
            size="medium"
            onClick={addTaskFn}
          >
            Add Task
          </Button>
          <Typography variant="h4" style={{ color: "red" }}>
            {msg}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex" }}>
        <Card sx={{ minWidth: 345, width: 450, height: 500, ml: 25, mt: 10 }}>
          <CardHeader title="All Tasks" sx={{ backgroundColor: "grey" }} />
          <CardContent>
            <Typography sx={{ mr: 20, textAlign: "justify" }}>
              {/* {console.log(todoList)} */}
              {todoList.map((val, ind) => {
                return (
                  <h4 key={ind}>
                    <Checkbox
                      checked={val.status}
                      onChange={(e) => {
                        setIsChecked(e.target.checked);
                        updatefn(e.target.checked, val.id);
                      }}
                    />
                    {val.Taskname}
                  </h4>
                );
              })}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 345, width: 450, height: 500, ml: 10, mt: 10 }}>
          <CardHeader
            title="Completed Tasks"
            sx={{ backgroundColor: "grey" }}
          />
          <CardContent>
            <Typography sx={{ mr: 30, textAlign: "justify" }}>
              {todoList.map((data, i) => {
                return <h1>{data.status === true ? data.Taskname : " "}</h1>;
              })}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 345, width: 450, height: 500, ml: 10, mt: 10 }}>
          <CardHeader title="Pending Tasks" sx={{ backgroundColor: "grey" }} />
          <CardContent>
            <Typography sx={{ mr: 30, textAlign: "justify" }}>
              {todoList.map((data, i) => {
                return <h1>{data.status === false ? data.Taskname : " "}</h1>;
              })}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default Main;
