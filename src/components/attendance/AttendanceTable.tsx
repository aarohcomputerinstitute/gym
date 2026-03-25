"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Download, Eye, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export interface AttendanceRecord {
  id: string
  memberName: string
  memberId: string
  date: string
  checkInTime: string
  checkOutTime: string | null
  method: "manual" | "qr" | "biometric"
  duration: string | null
}

const data: AttendanceRecord[] = [
  {
    id: "a1",
    memberName: "John Doe",
    memberId: "GYM-0001",
    date: "Today",
    checkInTime: "06:15 AM",
    checkOutTime: "07:30 AM",
    method: "biometric",
    duration: "1h 15m",
  },
  {
    id: "a2",
    memberName: "Jane Smith",
    memberId: "GYM-0042",
    date: "Today",
    checkInTime: "07:00 AM",
    checkOutTime: null,
    method: "manual",
    duration: null,
  },
  {
    id: "a3",
    memberName: "Robert Johnson",
    memberId: "GYM-0115",
    date: "Today",
    checkInTime: "07:45 AM",
    checkOutTime: null,
    method: "qr",
    duration: null,
  },
  {
    id: "a4",
    memberName: "Emily Davis",
    memberId: "GYM-0089",
    date: "Yesterday",
    checkInTime: "05:30 PM",
    checkOutTime: "06:45 PM",
    method: "biometric",
    duration: "1h 15m",
  },
]

export const columns: ColumnDef<AttendanceRecord>[] = [
  {
    accessorKey: "memberName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Member Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="px-4">
        <div className="font-medium">{row.getValue("memberName")}</div>
        <div className="text-xs text-muted-foreground">{row.original.memberId}</div>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "checkInTime",
    header: "Check-in",
    cell: ({ row }) => <div className="font-medium text-green-600">{row.getValue("checkInTime")}</div>,
  },
  {
    accessorKey: "checkOutTime",
    header: "Check-out",
    cell: ({ row }) => {
      const checkOut = row.getValue("checkOutTime") as string | null
      return (
        <div className={checkOut ? "text-orange-600 font-medium" : "text-muted-foreground italic"}>
          {checkOut || "Still in gym"}
        </div>
      )
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => <div>{row.getValue("duration") || "-"}</div>,
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => {
      const method = row.getValue("method") as string
      return (
        <Badge variant="outline" className={`capitalize
          ${method === 'biometric' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
          ${method === 'qr' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
          ${method === 'manual' ? 'bg-gray-50 text-gray-700 border-gray-200' : ''}
        `}>
          {method}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const record = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/5 transition-colors focus-visible:outline-none cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Member Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {!record.checkOutTime && (
               <DropdownMenuItem className="text-orange-600">Manual Check-out</DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-red-600">Delete Record</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function AttendanceTable({ data }: { data: AttendanceRecord[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  const handleExport = () => {
    const headers = table.getVisibleFlatColumns()
      .filter(col => col.id !== 'actions')
      .map(col => {
        const header = col.columnDef.header
        if (typeof header === 'string') return header
        if (col.id === 'memberName') return 'Member Name'
        return col.id.charAt(0).toUpperCase() + col.id.slice(1).replace(/([A-Z])/g, ' $1')
      })

    const rows = table.getFilteredRowModel().rows.map(row => {
      return table.getVisibleFlatColumns()
        .filter(col => col.id !== 'actions')
        .map(col => {
          const val = row.getValue(col.id)
          return val
        })
    })

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `attendance_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.click()
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Search by member name..."
          value={(table.getColumn("memberName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("memberName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button variant="outline" className="ml-auto" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Log
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer">
            Columns <ChevronDown className="ml-2 h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.columnDef.header && typeof column.columnDef.header === 'string' 
                      ? column.columnDef.header 
                      : column.id.charAt(0).toUpperCase() + column.id.slice(1).replace(/([A-Z])/g, ' $1')}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length} record(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
