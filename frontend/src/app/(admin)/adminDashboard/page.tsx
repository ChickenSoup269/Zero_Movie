"use client"
import React, { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts"
import { MovieService, Movie } from "@/services/movieService"
import UserService from "@/services/userService"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  DownloadIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
  UsersIcon,
  Film,
  DollarSign,
} from "lucide-react"

// Add a RevenueService to handle revenue-related API calls
const RevenueService = {
  async getMovieRevenue() {
    try {
      // This would be replaced with an actual API call
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics/revenue/movies`
      )
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch movie revenue:", error)
      // Return mock data for demonstration
      return [
        { title: "Avengers: Endgame", revenue: 84000, tickets: 400 },
        { title: "Spider-Man: No Way Home", revenue: 65000, tickets: 325 },
        { title: "The Batman", revenue: 52000, tickets: 260 },
        { title: "Dune", revenue: 48000, tickets: 240 },
        { title: "No Time to Die", revenue: 40000, tickets: 200 },
      ]
    }
  },

  async getMonthlyRevenue() {
    try {
      // This would be replaced with an actual API call
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics/revenue/monthly`
      )
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch monthly revenue:", error)
      // Return mock data for demonstration
      return [
        { name: "Jan", revenue: 45000 },
        { name: "Feb", revenue: 52000 },
        { name: "Mar", revenue: 49000 },
        { name: "Apr", revenue: 60000 },
        { name: "May", revenue: 72000 },
        { name: "Jun", revenue: 68000 },
        { name: "Jul", revenue: 75000 },
        { name: "Aug", revenue: 80000 },
        { name: "Sep", revenue: 87000 },
        { name: "Oct", revenue: 90000 },
        { name: "Nov", revenue: 85000 },
        { name: "Dec", revenue: 95000 },
      ]
    }
  },

  async getRevenueByGenre() {
    try {
      // This would be replaced with an actual API call
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics/revenue/genres`
      )
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch genre revenue:", error)
      // Return mock data for demonstration
      return [
        { name: "Action", value: 180000 },
        { name: "Drama", value: 120000 },
        { name: "Comedy", value: 150000 },
        { name: "Sci-Fi", value: 100000 },
        { name: "Horror", value: 80000 },
        { name: "Romance", value: 70000 },
      ]
    }
  },

  async getUserAcquisition() {
    try {
      // This would be replaced with an actual API call
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics/users/acquisition`
      )
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch user acquisition data:", error)
      // Return mock data for demonstration
      return [
        { name: "Jan", users: 120 },
        { name: "Feb", users: 150 },
        { name: "Mar", users: 180 },
        { name: "Apr", users: 210 },
        { name: "May", users: 250 },
        { name: "Jun", users: 280 },
        { name: "Jul", users: 320 },
        { name: "Aug", users: 350 },
        { name: "Sep", users: 380 },
        { name: "Oct", users: 410 },
        { name: "Nov", users: 430 },
        { name: "Dec", users: 450 },
      ]
    }
  },
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [movies, setMovies] = useState<Movie[]>([])
  const [users, setUsers] = useState<
    { _id: string; fullName: string; username: string; createdAt: string }[]
  >([])
  const [movieRevenue, setMovieRevenue] = useState([])
  const [monthlyRevenue, setMonthlyRevenue] = useState<
    { name: string; revenue: number }[]
  >([])
  const [genreRevenue, setGenreRevenue] = useState([])
  const [userAcquisition, setUserAcquisition] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedFilter, setSelectedFilter] = useState("all")

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ]

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch data from services
        const moviesData = await MovieService.getAllMovies()
        const usersResponse = await UserService.getAllUsers()
        const movieRevenueData = await RevenueService.getMovieRevenue()
        const monthlyRevenueData = await RevenueService.getMonthlyRevenue()
        const genreRevenueData = await RevenueService.getRevenueByGenre()
        const userAcquisitionData = await RevenueService.getUserAcquisition()

        setMovies(moviesData)
        setUsers(usersResponse?.data || [])
        setMovieRevenue(movieRevenueData)
        setMonthlyRevenue(monthlyRevenueData)
        setGenreRevenue(genreRevenueData)
        setUserAcquisition(userAcquisitionData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate total revenue from monthly data
  const totalRevenue = monthlyRevenue.reduce(
    (sum, month) => sum + month.revenue,
    0
  )

  // Calculate total users
  const totalUsers = users.length

  // Calculate total movies
  const totalMovies = movies.length

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Button variant="outline" size="sm">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">Refresh</Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
            <Film className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMovies}</div>
            <p className="text-xs text-muted-foreground">+8 new this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-4 md:w-1/2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Revenue Chart */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>
                  Revenue trends throughout the year
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue by Genre */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Revenue by Genre</CardTitle>
                <CardDescription>
                  Distribution of revenue across genres
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genreRevenue}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {genreRevenue.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Revenue Movies */}
            <Card>
              <CardHeader>
                <CardTitle>Top Revenue Movies</CardTitle>
                <CardDescription>
                  Movies generating the most revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Movie Title</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Tickets</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movieRevenue.slice(0, 5).map((movie) => (
                      <TableRow key={movie.title}>
                        <TableCell>{movie.title}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(movie.revenue)}
                        </TableCell>
                        <TableCell className="text-right">
                          {movie.tickets}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  View All
                </Button>
              </CardFooter>
            </Card>

            {/* User Growth */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  New user registrations over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userAcquisition}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Movies Tab */}
        <TabsContent value="movies">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Movie Management</CardTitle>
                <CardDescription>Manage your movie catalog</CardDescription>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <Input placeholder="Search movies..." className="w-64" />
                  <Button size="icon" variant="ghost">
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                </div>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Movie
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead>Age Rating</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Loading movies...
                      </TableCell>
                    </TableRow>
                  ) : movies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No movies found
                      </TableCell>
                    </TableRow>
                  ) : (
                    movies.slice(0, 10).map((movie) => (
                      <TableRow key={movie._id}>
                        <TableCell>{movie.title}</TableCell>
                        <TableCell>
                          {new Date(movie.releaseDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{movie.ageRating}</TableCell>
                        <TableCell>{movie.voteAverage.toFixed(1)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>Showing 1-10 of {movies.length} movies</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage your users</CardDescription>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <Input placeholder="Search users..." className="w-64" />
                  <Button size="icon" variant="ghost">
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                </div>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.slice(0, 10).map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>Showing 1-10 of {users.length} users</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Date Range</CardTitle>
                <CardDescription>Select date range for reports</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border w-full"
                />
              </CardContent>
              <CardFooter>
                <div className="grid w-full gap-2">
                  <Select
                    value={selectedFilter}
                    onValueChange={setSelectedFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This week</SelectItem>
                      <SelectItem value="month">This month</SelectItem>
                      <SelectItem value="year">This year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Generate Report</Button>
                </div>
              </CardFooter>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Movie Revenue Chart</CardTitle>
                <CardDescription>
                  Revenue by top-performing movies
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={movieRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" />
                    <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Details</CardTitle>
                <CardDescription>
                  Detailed breakdown of revenue sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Ticket Sales</TableHead>
                      <TableHead>Subscriptions</TableHead>
                      <TableHead>Rentals</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyRevenue.slice(0, 6).map((month) => (
                      <TableRow key={month.name}>
                        <TableCell>{month.name}</TableCell>
                        <TableCell>
                          {formatCurrency(month.revenue * 0.7)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(month.revenue * 0.2)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(month.revenue * 0.1)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(month.revenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  Download Full Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
