"use client"

import React from "react"
import { MoreHorizontal, Folder, Share2, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu"
import { Button } from "@/components/shadcn/ui/button"

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: React.ComponentType<{ className?: string }>
  }[]
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Documents</h3>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="flex items-center justify-between group">
              <a
                href={item.url}
                className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground flex-1"
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </a>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                    <span className="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-24 rounded-lg">
                  <DropdownMenuItem>
                    <Folder className="h-3 w-3 mr-2" />
                    <span>Open</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="h-3 w-3 mr-2" />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-3 w-3 mr-2" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
        >
          <MoreHorizontal className="h-4 w-4 mr-2" />
          <span>More</span>
        </Button>
      </div>
    </div>
  )
}
