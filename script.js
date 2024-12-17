 // Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    getDoc, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD_Hf68pJ7fSoqpG2MTMuSfpzEPhDNvOxM",
    authDomain: "taskman-59024.firebaseapp.com",
    projectId: "taskman-59024",
    storageBucket: "taskman-59024.firebasestorage.app",
    messagingSenderId: "1015940928782",
    appId: "1:1015940928782:web:d202fbdfc76b4dad34735f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const notify = document.querySelector('.notify');
const taskInput = document.querySelector('#task');
const taskDetailInput = document.querySelector('#taskDetail');
const addBtn = document.querySelector('#add_Data');
const updateDataBtn = document.querySelector('#update_data');

// Add task to Firestore
async function addTask() {
    const task = taskInput.value;
    const taskDetail = taskDetailInput.value;

    if (task && taskDetail) {
        try {
            await addDoc(collection(db, "tasks"), { task, taskDetail });

            notify.innerHTML = "Task added successfully!";
            taskInput.value = "";
            taskDetailInput.value = "";

            setTimeout(() => (notify.innerHTML = ""), 3000);
            GetData(); // Refresh task list
        } catch (error) {
            console.error("Error adding task:", error);
        }
    } else {
        notify.innerHTML = "Please fill in both fields.";
    }
}

// Fetch and display tasks
async function GetData() {
    try {
        const snapshot = await getDocs(collection(db, "tasks"));
        let html = "";

        snapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <tr>
                    <td>${data.task}</td>
                    <td>${data.taskDetail}</td>
                    <td><button class="del_btn" onclick="deleteData('${doc.id}')">Delete</button></td>
                    <td><button class="up_btn" onclick="updateData('${doc.id}')">Update</button></td>
                </tr>`;
        });

        document.querySelector('table tbody').innerHTML = html;
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

// Delete task
window.deleteData = async function (id) {
    try {
        await deleteDoc(doc(db, "tasks", id));

        notify.innerHTML = "Task deleted successfully!";
        setTimeout(() => (notify.innerHTML = ""), 3000);

        GetData(); // Refresh task list
    } catch (error) {
        console.error("Error deleting task:", error);
    }
};

// Update task
window.updateData = async function (id) {
    try {
        const docSnap = await getDoc(doc(db, "tasks", id));

        if (docSnap.exists()) {
            const currentData = docSnap.data();
            taskInput.value = currentData.task;
            taskDetailInput.value = currentData.taskDetail;

            updateDataBtn.classList.add('show');
            addBtn.classList.add('hide');

            // Event listener for updating the task
            updateDataBtn.onclick = async function () {
                const updatedTask = taskInput.value;
                const updatedTaskDetail = taskDetailInput.value;

                if (updatedTask && updatedTaskDetail) {
                    await updateDoc(doc(db, "tasks", id), {
                        task: updatedTask,
                        taskDetail: updatedTaskDetail
                    });

                    notify.innerHTML = "Task updated successfully!";
                    GetData();

                    updateDataBtn.classList.remove('show');
                    addBtn.classList.remove('hide');

                    taskInput.value = "";
                    taskDetailInput.value = "";

                    setTimeout(() => (notify.innerHTML = ""), 3000);
                }
            };
        } else {
            notify.innerHTML = "Task not found!";
        }
    } catch (error) {
        console.error("Error updating task:", error);
    }
};

// Event listeners
addBtn.addEventListener('click', addTask);
GetData(); // Initial fetch
