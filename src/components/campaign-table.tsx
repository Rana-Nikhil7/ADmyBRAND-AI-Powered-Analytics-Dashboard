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

// STEP 1: Define the shape of your Campaign data. This replaces 'any'.
export interface Campaign {
  id: number; // Make sure your mock data includes a unique 'id' for each campaign
  campaignName: string;
  status: "Active" | "Paused" | "Completed";
  spend: string;
  roi: string;
  date: string;
}

// STEP 2: Use the new 'Campaign' type for the component's props.
export function CampaignTable({ data }: { data: Campaign[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<Campaign["status"] | "all">("all")
  const [currentPage, setCurrentPage] = useState(1)
  // Use 'keyof Campaign' for type-safe sorting
  const [sortField, setSortField] = useState<keyof Campaign | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const itemsPerPage = 5

  const filteredData = data.filter(
    (campaign) =>
      (campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || campaign.status === statusFilter)
  )

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];
    
    // This sorting logic is now type-safe
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: keyof Campaign) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getStatusBadge = (status: Campaign["status"]) => {
    const variants: Record<Campaign['status'], "default" | "secondary" | "outline"> = {
      Active: "default",
      Paused: "secondary",
      Completed: "outline",
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  function handleExportPDF() {
    const doc = new jsPDF();
    doc.text("Campaign Performance", 14, 16);

    autoTable(doc, {
      startY: 24,
      head: [["Campaign Name", "Status", "Spend", "ROI", "Date"]],
      // The 'campaign' parameter is now correctly typed as 'Campaign'
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
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Campaign["status"] | "all")}>
            <SelectTrigger className="w-[180px]">
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
                {/* Simplified headers for clarity */}
                <TableHead onClick={() => handleSort('campaignName')}><Button variant="ghost">Campaign Name<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                <TableHead onClick={() => handleSort('status')}><Button variant="ghost">Status<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                <TableHead onClick={() => handleSort('spend')}><Button variant="ghost">Spend<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                <TableHead onClick={() => handleSort('roi')}><Button variant="ghost">ROI<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                <TableHead onClick={() => handleSort('date')}><Button variant="ghost">Date<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((campaign) => (
                <TableRow key={campaign.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{campaign.campaignName}</TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell>{campaign.spend}</TableCell>
                  <TableCell>{campaign.roi}</TableCell>
                  <TableCell>{campaign.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
