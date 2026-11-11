import { createFileRoute } from "@tanstack/react-router";
import { CoderApp } from "@/components/coder/app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <CoderApp />;
}
