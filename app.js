import express from "express";
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from "#db/queries/employees";

const app = express();
app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to the Fullstack Employees API.");
});

// Get all employees
app.get("/employees", async (req, res, next) => {
  try {
    const employees = await getEmployees();
    res.json(employees);
  } catch (err) {
    next(err);
  }
});

// Get employee by id
app.get("/employees/:id", async (req, res, next) => {
  const idStr = req.params.id;
  const id = Number(idStr);

  // Check for scientific notation, non-integers, or negative numbers
  if (
    idStr.includes("e") ||
    idStr.includes("E") ||
    !Number.isInteger(id) ||
    id < 0 ||
    isNaN(id)
  ) {
    return res.status(400).json({ error: "Invalid employee id" });
  }

  try {
    const employee = await getEmployee(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(employee);
  } catch (err) {
    next(err);
  }
});

// Create employee
app.post("/employees", async (req, res, next) => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Request body required" });
  }
  const { name, birthday, salary } = req.body;
  if (!name || !birthday || salary === undefined) {
    return res.status(400).json({ error: "Missing required field(s)" });
  }
  try {
    const employee = await createEmployee({ name, birthday, salary });
    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
});

// Update employee
app.put("/employees/:id", async (req, res, next) => {
  const idStr = req.params.id;
  const id = Number(idStr);

  // Check for scientific notation, non-integers, or negative numbers
  if (
    idStr.includes("e") ||
    idStr.includes("E") ||
    !Number.isInteger(id) ||
    id < 0 ||
    isNaN(id)
  ) {
    return res.status(400).json({ error: "Invalid employee id" });
  }

  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Request body required" });
  }
  const { name, birthday, salary } = req.body;
  if (!name || !birthday || salary === undefined) {
    return res.status(400).json({ error: "Missing required field(s)" });
  }
  try {
    const updated = await updateEmployee({ id, name, birthday, salary });
    if (!updated) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete employee
app.delete("/employees/:id", async (req, res, next) => {
  const idStr = req.params.id;
  const id = Number(idStr);

  // Check for scientific notation, non-integers, or negative numbers
  if (
    idStr.includes("e") ||
    idStr.includes("E") ||
    !Number.isInteger(id) ||
    id < 0 ||
    isNaN(id)
  ) {
    return res.status(400).json({ error: "Invalid employee id" });
  }

  try {
    const deleted = await deleteEmployee(id);
    if (!deleted) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
