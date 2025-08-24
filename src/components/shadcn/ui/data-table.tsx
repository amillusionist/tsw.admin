"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/ui/card"

interface DataItem {
  id: string
  header: string
  description: string
  status: string
  priority: string
  category: string
  created: string
  updated: string
}

interface DataTableProps {
  data: DataItem[]
}

export function DataTable({ data }: DataTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Overview</CardTitle>
        <CardDescription>
          A comprehensive view of your system data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <h3 className="font-medium">{item.header}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.priority === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : item.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.priority}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div>Created: {item.created}</div>
                <div>Updated: {item.updated}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
