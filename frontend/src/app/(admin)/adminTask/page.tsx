"use client"
import React, { useState, useEffect } from "react"
import {
  PlusCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Filter,
  Download,
  Upload,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { Toast } from "@/components/ui/toast"

// Default initial tasks
const initialTasks = [
  {
    id: 1,
    title: "Review movie submissions",
    description: "Check new movie submissions and approve or reject them",
    status: "in-progress",
    priority: "high",
    dueDate: "2025-04-25",
    createdAt: "2025-04-20",
  },
  {
    id: 2,
    title: "Update genre categories",
    description: "Add new genre categories for upcoming movie releases",
    status: "todo",
    priority: "medium",
    dueDate: "2025-04-27",
    createdAt: "2025-04-19",
  },
  {
    id: 3,
    title: "Fix user profile bug",
    description: "Address reported issue with user profile image uploads",
    status: "completed",
    priority: "high",
    dueDate: "2025-04-18",
    createdAt: "2025-04-15",
  },
  {
    id: 4,
    title: "Prepare monthly analytics report",
    description: "Gather data and create analytics report for stakeholders",
    status: "todo",
    priority: "medium",
    dueDate: "2025-04-30",
    createdAt: "2025-04-18",
  },
]

export default function TaskManagement() {
  const [tasks, setTasks] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: format(new Date(), "yyyy-MM-dd"),
  })
  const [editingTask, setEditingTask] = useState(null)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importText, setImportText] = useState("")

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("adminTasks")
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (error) {
        console.error("Error parsing tasks from localStorage:", error)
        setTasks(initialTasks)
        saveTasksToLocalStorage(initialTasks)
      }
    } else {
      setTasks(initialTasks)
      saveTasksToLocalStorage(initialTasks)
    }
  }, [])

  // Save tasks to localStorage
  const saveTasksToLocalStorage = (taskData) => {
    localStorage.setItem("adminTasks", JSON.stringify(taskData))
  }

  // Handle adding a new task
  const handleAddTask = () => {
    const taskToAdd = {
      id: tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1,
      ...newTask,
      createdAt: format(new Date(), "yyyy-MM-dd"),
    }

    const updatedTasks = [...tasks, taskToAdd]
    setTasks(updatedTasks)
    saveTasksToLocalStorage(updatedTasks)

    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: format(new Date(), "yyyy-MM-dd"),
    })
    setIsAddDialogOpen(false)

    toast({
      title: "Task created",
      description: "Your new task has been created successfully.",
    })
  }

  // Handle editing a task
  const startEditingTask = (task) => {
    setEditingTask({ ...task })
    setIsEditDialogOpen(true)
  }

  const saveEditedTask = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === editingTask.id ? editingTask : task
    )
    setTasks(updatedTasks)
    saveTasksToLocalStorage(updatedTasks)

    setIsEditDialogOpen(false)
    setEditingTask(null)

    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    })
  }

  // Handle deleting a task
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)
    saveTasksToLocalStorage(updatedTasks)

    toast({
      title: "Task deleted",
      description: "Your task has been deleted successfully.",
    })
  }

  // Handle changing task status
  const changeTaskStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    )
    setTasks(updatedTasks)
    saveTasksToLocalStorage(updatedTasks)

    toast({
      title: "Status updated",
      description: `Task status changed to ${newStatus.replace("-", " ")}.`,
    })
  }

  // Export tasks to JSON file
  const exportTasksToJson = () => {
    const dataStr = JSON.stringify(tasks, null, 2)
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `admin-tasks-${format(
      new Date(),
      "yyyy-MM-dd"
    )}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Tasks exported",
      description: "Your tasks have been exported to a JSON file.",
    })
  }

  // Import tasks from JSON
  const handleImportTasks = () => {
    try {
      const importedTasks = JSON.parse(importText)

      if (!Array.isArray(importedTasks)) {
        throw new Error("Imported data is not an array")
      }

      // Validate each task has required fields
      importedTasks.forEach((task) => {
        if (!task.id || !task.title || !task.status) {
          throw new Error("Some tasks are missing required fields")
        }
      })

      setTasks(importedTasks)
      saveTasksToLocalStorage(importedTasks)
      setIsImportDialogOpen(false)
      setImportText("")

      toast({
        title: "Tasks imported",
        description: `Successfully imported ${importedTasks.length} tasks.`,
      })
    } catch (error) {
      toast({
        title: "Import failed",
        description:
          "Please check that your JSON is valid and has the correct format.",
        variant: "destructive",
      })
    }
  }

  // Handle file upload for import
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const fileContent = e.target.result
        setImportText(fileContent)
      } catch (error) {
        toast({
          title: "File read error",
          description: "Could not read the file content.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  // Filter tasks based on active filter
  const filteredTasks = () => {
    if (activeFilter === "all") return tasks
    if (activeFilter === "completed")
      return tasks.filter((task) => task.status === "completed")
    if (activeFilter === "in-progress")
      return tasks.filter((task) => task.status === "in-progress")
    if (activeFilter === "todo")
      return tasks.filter((task) => task.status === "todo")
    if (activeFilter === "high-priority")
      return tasks.filter((task) => task.priority === "high")
    return tasks
  }

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
        )
      case "in-progress":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>
        )
      case "todo":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">To Do</Badge>
        )
      default:
        return <Badge>Unknown</Badge>
    }
  }

  // Get priority badge color
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge
            variant="outline"
            className="border-orange-500 text-orange-500"
          >
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Calculate due date status
  const getDueDateStatus = (dueDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)

    const daysDiff = Math.floor((due - today) / (1000 * 60 * 60 * 24))

    if (daysDiff < 0) {
      return (
        <span className="text-red-500 text-sm flex items-center gap-1">
          <Clock size={16} /> Overdue by {Math.abs(daysDiff)} days
        </span>
      )
    } else if (daysDiff === 0) {
      return (
        <span className="text-orange-500 text-sm flex items-center gap-1">
          <Clock size={16} /> Due today
        </span>
      )
    } else if (daysDiff <= 2) {
      return (
        <span className="text-yellow-500 text-sm flex items-center gap-1">
          <Clock size={16} /> Due in {daysDiff} days
        </span>
      )
    } else {
      return (
        <span className="text-gray-500 text-sm flex items-center gap-1">
          <Calendar size={16} /> Due: {format(new Date(dueDate), "MMM d, yyyy")}
        </span>
      )
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and track your administrative tasks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={exportTasksToJson}
          >
            <Download size={16} />
            Export
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsImportDialogOpen(true)}
          >
            <Upload size={16} />
            Import
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setActiveFilter("all")}>
                  All Tasks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveFilter("completed")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActiveFilter("in-progress")}
                >
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveFilter("todo")}>
                  To Do
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setActiveFilter("high-priority")}
                >
                  High Priority
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle size={16} />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Add the details for your new task below.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    placeholder="Task title"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    placeholder="Task description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="status" className="text-sm font-medium">
                      Status
                    </label>
                    <Select
                      value={newTask.status}
                      onValueChange={(value) =>
                        setNewTask({ ...newTask, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="priority" className="text-sm font-medium">
                      Priority
                    </label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) =>
                        setNewTask({ ...newTask, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="dueDate" className="text-sm font-medium">
                    Due Date
                  </label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddTask} disabled={!newTask.title}>
                  Create Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter indicator */}
      {activeFilter !== "all" && (
        <div className="mb-4 flex items-center">
          <span className="text-sm text-gray-500">
            Filtered by: <strong>{activeFilter.replace("-", " ")}</strong>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilter("all")}
            className="ml-2 h-7 text-xs"
          >
            Clear
          </Button>
        </div>
      )}

      {/* Tasks area */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          {/* Grid view */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks().map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Open menu</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-more-vertical"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => startEditingTask(task)}
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => changeTaskStatus(task.id, "todo")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                          >
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                          <span>Mark as Todo</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            changeTaskStatus(task.id, "in-progress")
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                          >
                            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                            <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                          </svg>
                          <span>Mark as In Progress</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => changeTaskStatus(task.id, "completed")}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          <span>Mark as Completed</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => deleteTask(task.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {task.description}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-between border-t pt-4">
                  {getDueDateStatus(task.dueDate)}
                  <span className="text-xs text-gray-500">
                    Created: {format(new Date(task.createdAt), "MMM d")}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          {/* List view */}
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="text-left p-3 font-medium">Task</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Priority</th>
                  <th className="text-left p-3 font-medium">Due Date</th>
                  <th className="text-left p-3 font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTasks().map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-gray-500">
                          {task.description.length > 50
                            ? `${task.description.substring(0, 50)}...`
                            : task.description}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{getStatusBadge(task.status)}</td>
                    <td className="p-3">{getPriorityBadge(task.priority)}</td>
                    <td className="p-3">{getDueDateStatus(task.dueDate)}</td>
                    <td className="p-3">
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => startEditingTask(task)}
                        >
                          <Edit2 size={16} />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 size={16} />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update the details of your task.
            </DialogDescription>
          </DialogHeader>

          {editingTask && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="edit-title"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                  placeholder="Task title"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="edit-description"
                  className="text-sm font-medium"
                >
                  Description
                </label>
                <Textarea
                  id="edit-description"
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                  placeholder="Task description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select
                    value={editingTask.status}
                    onValueChange={(value) =>
                      setEditingTask({ ...editingTask, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="edit-priority"
                    className="text-sm font-medium"
                  >
                    Priority
                  </label>
                  <Select
                    value={editingTask.priority}
                    onValueChange={(value) =>
                      setEditingTask({ ...editingTask, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="edit-dueDate" className="text-sm font-medium">
                  Due Date
                </label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={editingTask.dueDate}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, dueDate: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveEditedTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Tasks Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Tasks</DialogTitle>
            <DialogDescription>
              Import tasks from a JSON file or paste JSON data below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="import-file" className="text-sm font-medium">
                Upload JSON File
              </label>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="import-text" className="text-sm font-medium">
                Or paste JSON data
              </label>
              <Textarea
                id="import-text"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste JSON data here"
                rows={10}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsImportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleImportTasks} disabled={!importText.trim()}>
              Import Tasks
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* No tasks message */}
      {filteredTasks().length === 0 && (
        <div className="text-center py-10">
          <div className="mb-4 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto"
            >
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium">No tasks found</h3>
          <p className="text-gray-500 mt-1">
            There are no tasks matching your current filter.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setActiveFilter("all")}
          >
            View all tasks
          </Button>
        </div>
      )}
    </div>
  )
}
