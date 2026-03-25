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

export interface Payment {
  id: string
  invoiceNumber: string
  memberName: string
  amount: number
  date: string
  method: string
  transactionId?: string
  status: "paid" | "pending" | "failed" | "refunded"
}

const data: Payment[] = [
  {
    id: "p1",
    invoiceNumber: "INV-2024-001",
    memberName: "John Doe",
    amount: 4499,
    date: "2024-01-15",
    method: "UPI",
    status: "paid",
  },
  {
    id: "p2",
    invoiceNumber: "INV-2024-002",
    memberName: "Jane Smith",
    amount: 999,
    date: "2024-01-16",
    method: "Cash",
    status: "paid",
  },
  {
    id: "p3",
    invoiceNumber: "INV-2024-003",
    memberName: "Robert Johnson",
    amount: 7999,
    date: "2024-01-18",
    method: "Credit Card",
    status: "pending",
  },
  {
    id: "p4",
    invoiceNumber: "INV-2024-004",
    memberName: "Emily Davis",
    amount: 2499,
    date: "2024-01-20",
    method: "UPI",
    status: "refunded",
  },
]

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice",
    cell: ({ row }) => <div className="font-medium px-4">{row.getValue("invoiceNumber")}</div>,
  },
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
    cell: ({ row }) => <div className="px-4">{row.getValue("memberName")}</div>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "method",
    header: "Payment Method",
    cell: ({ row }) => {
      const method = row.getValue("method") as string
      return (
        <div className="flex items-center gap-2">
          {method === 'upi' && <span className="text-xs">📱 UPI</span>}
          {method === 'cash' && <span className="text-xs">💵 Cash</span>}
          {method === 'card' && <span className="text-xs">💳 Card</span>}
          {method === 'bank_transfer' && <span className="text-xs">🏦 Bank</span>}
          {method === 'online' && <span className="text-xs">🌐 Online</span>}
          {!['upi', 'cash', 'card', 'bank_transfer', 'online'].includes(method) && <span className="text-xs capitalize">{method}</span>}
        </div>
      )
    },
  },
  {
    accessorKey: "transactionId",
    header: "Reference / TXN ID",
    cell: ({ row }) => (
      <div className="font-mono text-[10px] text-slate-400">
        {row.getValue("transactionId") || "—"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant="outline" className={`capitalize
          ${status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : ''}
          ${status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
          ${status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' : ''}
          ${status === 'refunded' ? 'bg-gray-50 text-gray-700 border-gray-200' : ''}
        `}>
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {payment.status === 'pending' && (
              <DropdownMenuItem className="text-green-600">Mark as Paid</DropdownMenuItem>
            )}
            {payment.status === 'paid' && (
              <DropdownMenuItem className="text-orange-600">Initiate Refund</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function PaymentTable({ data }: { data: Payment[] }) {
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
          if (col.id === 'amount') return `₹${val}`
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
    link.setAttribute('download', `payments_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.click()
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter by invoice..."
          value={(table.getColumn("invoiceNumber")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("invoiceNumber")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button variant="outline" className="ml-auto" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length} payment(s).
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
