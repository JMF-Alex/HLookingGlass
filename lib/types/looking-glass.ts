import type { LucideIcon } from "lucide-react";

export type Tool = {
    id: string;
    name: string;
    icon: LucideIcon
};

export type TestFile = {
    size: string;
    url: string
};