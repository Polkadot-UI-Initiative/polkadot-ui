import { Badge } from "../ui/badge";

interface ExamplePlaceholderProps {
  title: string;
  description?: string;
}

export function ExamplePlaceholder({ title }: ExamplePlaceholderProps) {
  return (
    <Badge variant="destructive">
      {title} not yet implemented - coming soon
    </Badge>
  );
}
