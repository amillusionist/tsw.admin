"use client"

import React from "react"
import { Plus, Mail } from "lucide-react"
import { Button } from "@/components/shadcn/ui/button"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>Quick Create</span>
        </Button>
        <Button
          size="icon"
          className="h-8 w-8"
          variant="outline"
        >
          <Mail className="h-4 w-4" />
          <span className="sr-only">Inbox</span>
        </Button>
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.title}
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <a href={item.url}>
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                <span>{item.title}</span>
              </a>
            </Button>
          );
        })}
      </div>
    </div>
  )
}
