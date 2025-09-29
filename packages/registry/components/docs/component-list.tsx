"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ComponentInfo {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
}

interface Registry {
  items: ComponentInfo[];
}

export function ComponentList() {
  const [components, setComponents] = useState<ComponentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComponents() {
      try {
        const response = await fetch("/registry-dedot.json");
        if (!response.ok) {
          throw new Error("Failed to fetch registry");
        }
        const registry: Registry = await response.json();
        setComponents(registry.items || []);
      } catch (error) {
        console.error("Error fetching components:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchComponents();
  }, []);

  if (loading) {
    return <div>Loading components...</div>;
  }

  if (components.length === 0) {
    return <div>No components available.</div>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Available components you can install:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {components.map((component) => (
          <div key={component.name} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Link
                href={`/docs/components/${component.name}`}
                className="text-lg font-semibold hover:text-primary transition-colors"
              >
                {component.title}
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {component.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
