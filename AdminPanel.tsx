"use client"

import { useState, useEffect } from "react"
import { fetchSubmissions, deleteSubmission, addSubmission, updateSubmission } from "./supabaseClient"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { NetworkCounter } from "./components/NetworkCounter"

type Submission = {
  id: number
  name: string
  email: string
  network: string
  address: string
  tokens_sent: boolean
  amount_sent: number
}

export function AdminPanel() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [newSubmission, setNewSubmission] = useState<Omit<Submission, "id">>({
    name: "",
    email: "",
    network: "Solana",
    address: "",
    tokens_sent: false,
    amount_sent: 0,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [networkCounts, setNetworkCounts] = useState({ Solana: 0, BSC: 0, Polygon: 0 })

  const recordsPerPage = 100
  const totalPages = Math.ceil(submissions.length / recordsPerPage)

  useEffect(() => {
    loadSubmissions()
  }, [])

  useEffect(() => {
    updateNetworkCounts()
  }, []) //Fixed unnecessary dependency

  async function loadSubmissions() {
    try {
      setLoading(true)
      const data = await fetchSubmissions()
      setSubmissions(data)
    } catch (error) {
      console.error("Error fetching submissions:", error)
    } finally {
      setLoading(false)
    }
  }

  function updateNetworkCounts() {
    const counts = submissions.reduce(
      (acc, submission) => {
        acc[submission.network as keyof typeof acc]++
        return acc
      },
      { Solana: 0, BSC: 0, Polygon: 0 },
    )
    setNetworkCounts(counts)
  }

  async function handleUpdateSubmission(id: number, updates: Partial<Submission>) {
    try {
      const updatedSubmission = await updateSubmission(id, updates)
      setSubmissions(submissions.map((s) => (s.id === id ? { ...s, ...updatedSubmission } : s)))
    } catch (error) {
      console.error("Error updating submission:", error)
    }
  }

  async function handleDeleteSubmission(id: number) {
    try {
      await deleteSubmission(id)
      setSubmissions(submissions.filter((s) => s.id !== id))
    } catch (error) {
      console.error("Error deleting submission:", error)
    }
  }

  async function handleAddSubmission(e: React.FormEvent) {
    e.preventDefault()
    try {
      const addedSubmission = await addSubmission(newSubmission)
      setSubmissions([addedSubmission, ...submissions])
      setNewSubmission({
        name: "",
        email: "",
        network: "Solana",
        address: "",
        tokens_sent: false,
        amount_sent: 0,
      })
    } catch (error) {
      console.error("Error adding submission:", error)
    }
  }

  const paginatedSubmissions = submissions.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)

  if (loading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div className="space-y-4 p-4 bg-black text-green-400 font-mono text-sm">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <div className="flex space-x-3">
          {Object.entries(networkCounts).map(([network, count]) => (
            <NetworkCounter key={network} network={network as "Solana" | "BSC" | "Polygon"} count={count} />
          ))}
        </div>
      </div>

      <form onSubmit={handleAddSubmission} className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Name"
            value={newSubmission.name}
            onChange={(e) => setNewSubmission({ ...newSubmission, name: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={newSubmission.email}
            onChange={(e) => setNewSubmission({ ...newSubmission, email: e.target.value })}
            required
          />
          <select
            className="bg-black border border-green-400 rounded px-2 py-1"
            value={newSubmission.network}
            onChange={(e) => setNewSubmission({ ...newSubmission, network: e.target.value })}
            required
          >
            <option value="Solana">Solana</option>
            <option value="Polygon">Polygon</option>
            <option value="BSC">BSC</option>
          </select>
          <Input
            placeholder="Address"
            value={newSubmission.address}
            onChange={(e) => setNewSubmission({ ...newSubmission, address: e.target.value })}
            required
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          size="sm"
          className="bg-green-500 text-blue-500 border-green-500 hover:bg-green-600"
        >
          Add Record
        </Button>
      </form>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-green-400">Name</TableHead>
              <TableHead className="text-green-400">Email</TableHead>
              <TableHead className="text-green-400">Network</TableHead>
              <TableHead className="text-green-400">Address</TableHead>
              <TableHead className="text-green-400">Tokens Sent</TableHead>
              <TableHead className="text-green-400">Amount Sent</TableHead>
              <TableHead className="text-green-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSubmissions.map((submission) => (
              <TableRow key={submission.id} className={submission.tokens_sent ? "bg-green-900/50" : ""}>
                <TableCell className={submission.tokens_sent ? "text-yellow-400" : ""}>{submission.name}</TableCell>
                <TableCell className={submission.tokens_sent ? "text-yellow-400" : ""}>{submission.email}</TableCell>
                <TableCell className={submission.tokens_sent ? "text-yellow-400" : ""}>{submission.network}</TableCell>
                <TableCell className={submission.tokens_sent ? "text-yellow-400" : ""}>{submission.address}</TableCell>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={submission.tokens_sent}
                    onChange={(e) => {
                      handleUpdateSubmission(submission.id, { tokens_sent: e.target.checked })
                      e.target.closest("tr")?.classList.toggle("bg-green-900/50", e.target.checked)
                      e.target
                        .closest("tr")
                        ?.querySelectorAll("td")
                        .forEach((td) => {
                          td.classList.toggle("text-yellow-400", e.target.checked)
                        })
                    }}
                    className="bg-black border-green-400"
                  />
                </TableCell>
                <TableCell className={submission.tokens_sent ? "text-yellow-400" : ""}>
                  <Input
                    type="number"
                    value={submission.amount_sent ?? 0}
                    onChange={(e) => handleUpdateSubmission(submission.id, { amount_sent: Number(e.target.value) })}
                    className={`w-20 bg-black border-green-400 ${submission.tokens_sent ? "text-yellow-400" : "text-green-400"}`}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDeleteSubmission(submission.id)}
                    variant="outline"
                    size="sm"
                    className={`text-red-500 border-red-500 hover:bg-red-500/20 ${
                      submission.tokens_sent ? "bg-black" : "bg-transparent"
                    }`}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
        >
          Previous
        </Button>
        <span className="text-green-400">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

