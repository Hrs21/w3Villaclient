import React, { useEffect } from "react";
import { useState } from "react";
import  axios from "axios"; 
import toast from "react-hot-toast";

const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState({ title: "", description: "", dueDate: "", status: "Pending" });

    const handleChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const addTask = async(e) => {
        e.preventDefault();
       //call backend api to save task
       const response = await axios.post("http://localhost:8000/api/task ", {...task}, { withCredentials: true });  
       
       const data=await response.data
        if(data.success){
            setTasks(data.tasks);
            setTask({ title: "", description: "", dueDate: "", status: "Pending" });
            toast.success(data.message);
     };
    }

     useEffect(() => {
        //call backend api to get all tasks
        const getTasks = async () => {
            const response = await axios.get("http://localhost:8000/api/tasks", { withCredentials: true });
            const data = await response.data;
            setTasks(data.tasks);
        };


        getTasks();
     },[]);

    const updateTaskStatus = async(id, status) => {
        const response = await axios.put(`http://localhost:8000/api/task/${id}`, { status }, { withCredentials: true });
        const data = await response.data;

        if(data.success){
            const updatedTasks = tasks.map(t => {
                if(t._id === id){
                    t.status = status;
                }
                return t;
            });
            setTasks(updatedTasks);

            toast.success(data.message);
        }else{
            toast.error(data.message);
        }
    };

    const deleteTask = async (id) => {
        //call backend api to delete task
       const response =await axios.delete(`http://localhost:8000/api/task/${id}`, { withCredentials: true });
        const data = await response.data;

        if(data.success){
            setTasks(tasks.filter(t => t._id !== id));
            toast.success(data.message);
        }else{
            toast.error(data.message)
        }

    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ textAlign: "center" }}>Task Management</h2>

            {/* Task Form */}
            <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "5px", marginBottom: "20px" }}>
                <input
                    type="text"
                    name="title"
                    placeholder="Task Title"
                    value={task.title}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                />
                <textarea
                    name="description"
                    placeholder="Task Description"
                    value={task.description}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "8px", marginBottom: "10px", height: "60px" }}
                />
                <input
                    type="date"
                    name="dueDate"
                    value={task.dueDate}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                />
                <select
                    name="status"
                    value={task.status}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <button
                    onClick={addTask}
                    style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Add Task
                </button>
            </div>

            {/* Task List */}
            {tasks && tasks.map(({ _id, title, description, dueDate, status }) => (
                <div key={_id} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "5px", marginBottom: "10px" }}>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <p><strong>Due Date:</strong> {dueDate.split('T')[0]}</p>
                    <label><strong>Status:</strong></label>
                    <select
                        value={status}
                        onChange={(e) => updateTaskStatus(_id, e.target.value)}
                        style={{ marginLeft: "10px", padding: "5px" }}
                    >
                        <option value="pending">Pending</option>
                        <option value="In-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button
                        onClick={() => deleteTask(_id)}
                        style={{
                            marginLeft: "10px",
                            padding: "5px 10px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
};

export default TaskManagement;
