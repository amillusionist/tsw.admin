"use client"

import * as React from "react"

export function NavSecondary({
  items,
}: {
  items: {
    title: string
    url: string
    icon: React.ComponentType<{ className?: string }>
  }[]
}) {
  return (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.title}
            href={item.url}
            className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </a>
        );
      })}
    </div>
  )
}
