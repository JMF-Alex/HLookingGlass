import { Activity, Cpu, Play, Globe } from "lucide-react";

import type { Tool, TestFile } from "@/lib/types";

export const TOOLS: Tool[] = [
  { id: "ping",        name: "ping",        icon: Activity },
  { id: "ping6",       name: "ping6",       icon: Activity },
  { id: "traceroute",  name: "traceroute",  icon: Play     },
  { id: "traceroute6", name: "traceroute6", icon: Play     },
  { id: "mtr",         name: "mtr",         icon: Cpu      },
  { id: "bgp",         name: "bgp",         icon: Globe    },
  { id: "bgp6",        name: "bgp6",        icon: Globe    },
];

export const TEST_FILES: TestFile[] = [
  { size: "size_100mb", url: "100mb" },
  { size: "size_1gb",   url: "1gb"   },
  { size: "size_10gb",  url: "10gb"  },
];