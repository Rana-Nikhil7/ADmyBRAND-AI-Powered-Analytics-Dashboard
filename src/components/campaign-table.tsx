"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, FileDown } from "lucide-react"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function CampaignTable({ data }: { data: any[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const itemsPerPage = 5

  const filteredData = data.filter(
    (campaign) =>
      (campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.status.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || campaign.status === statusFilter)
  )

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0

    let aValue = a[sortField as keyof typeof a]
    let bValue = b[sortField as keyof typeof b]

    if (sortField === "spend" || sortField === "roi") {
      aValue = Number.parseFloat(aValue.toString().replace(/[$%,]/g, ""))
      bValue = Number.parseFloat(bValue.toString().replace(/[$%,]/g, ""))
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "default",
      Paused: "secondary",
      Completed: "outline",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "default"}>{status}</Badge>
  }

  function handleExportPDF() {
    const doc = new jsPDF();
    doc.text("Campaign Performance", 14, 16);

    autoTable(doc, {
      startY: 24,
      head: [["Campaign Name", "Status", "Spend", "ROI", "Date"]],
      body: filteredData.map((campaign) => [
        campaign.campaignName,
        campaign.status,
        campaign.spend,
        campaign.roi,
        campaign.date,
      ]),
    });

    doc.save("campaign-performance.pdf");
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>
            Detailed breakdown of all marketing campaigns
          </CardDescription>
        </div>
        <Button onClick={handleExportPDF} size="sm" variant="outline">
          <FileDown className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center space-x-2 mb-4">
          <div className="relative flex-1 md:w-1/2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter} className="md:w-1/2 mt-4 md:mt-0">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Paused">Paused</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="h-auto p-0 font-medium hover:scale-105 transition-transform duration-200"
                  >
                    Campaign Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("status")}
                    className="h-auto p-0 font-medium hover:scale-105 transition-transform duration-200"
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("spend")}
                    className="h-auto p-0 font-medium hover:scale-105 transition-transform duration-200"
                  >
                    Spend
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("roi")}
                    className="h-auto p-0 font-medium hover:scale-105 transition-transform duration-200"
                  >
                    ROI
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((campaign) => (
                <TableRow key={campaign.id} className="hover:bg-muted/50 transition-colors duration-200 cursor-pointer">
                  <TableCell className="font-medium">{campaign.campaignName}</TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell>{campaign.spend}</TableCell>
                  <TableCell className="font-medium text-green-600">{campaign.roi}</TableCell>
                  <TableCell>{campaign.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length}{" "}
            results
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="hover:scale-105 transition-transform duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="hover:scale-105 transition-transform duration-200"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
