// services/taskService.js
import axios from "axios";

export const fetchTemplateTasks = async () => {
  const res = await axios.get(
    "https://mbclickerstrapi.onrender.com/api/tasks?filters[isTemplate][$eq]=true"
  );
  return res.data.data; // данные уже плоские, ничего разворачивать не нужно
};
