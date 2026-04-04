import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const isWindows = process.platform === "win32";
const TIMEOUT = 15000;

const VALID_TYPES = ["ping", "ping6", "traceroute", "traceroute6", "mtr", "bgp", "bgp6"] as const;
type TestType = typeof VALID_TYPES[number];

function isValidHost(host: string): boolean {
  const ipv4   = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6   = /^[a-fA-F0-9:]+$/;
  const domain = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
  const trimmed = host.trim();
  return ipv4.test(trimmed) || ipv6.test(trimmed) || domain.test(trimmed);
}

function isValidAsn(asn: string): boolean {
  return /^(AS)?\d{1,10}$/i.test(asn.trim());
}

function decode(buf: Buffer): string {
  return new TextDecoder("utf-8").decode(buf);
}

function getTimeout(testType: TestType): number {
  switch (testType) {
    case "mtr":
    case "traceroute":
    case "traceroute6":
      return 120000; // -> this is 2 minutes
    default:
      return 15000;
  }
}

function buildCommand(testType: TestType, host: string): string {
  const h = host.trim();
  const win = (cmd: string) => `chcp 65001 > nul && ${cmd}`;

  switch (testType) {
    case "ping":
      return isWindows ? win(`ping -n 4 ${h}`) : `ping -c 4 -W 3 ${h}`;
    case "ping6":
      return isWindows ? win(`ping -n 4 -6 ${h}`) : `ping6 -c 4 -W 3 ${h}`;
    case "traceroute":
      return isWindows ? win(`tracert ${h}`) : `traceroute -w 3 ${h}`;
    case "traceroute6":
      return isWindows ? win(`tracert ${h}`) : `traceroute6 -w 3 ${h}`;
    case "mtr":
      return isWindows ? win(`tracert ${h}`) : `mtr --report --report-cycles 5 --no-dns ${h}`;
    case "bgp": {
      const asn = h.replace(/^AS/i, "");
      return `whois -h whois.radb.net -- '-i origin AS${asn}' | grep -E "^route:|^descr:|^origin:" | head -40`;
    }
    case "bgp6": {
      const asn = h.replace(/^AS/i, "");
      return `whois -h whois.radb.net -- '-i origin AS${asn}' | grep -E "^route6:|^descr:|^origin:" | head -40`;
    }
  }
}

export async function POST(req: NextRequest) {
  const { host, testType } = await req.json();

  if (!host || typeof host !== "string") {
    return NextResponse.json({ error: "Invalid host" }, { status: 400 });
  }

  if (!VALID_TYPES.includes(testType)) {
    return NextResponse.json({ error: "Invalid test type" }, { status: 400 });
  }

  const isBgp = testType === "bgp" || testType === "bgp6";

  if (isBgp && !isValidAsn(host)) {
    return NextResponse.json({ error: "BGP lookup requires a valid ASN (e.g. AS13335 or 13335)" }, { status: 400 });
  }

  if (!isBgp && !isValidHost(host)) {
    return NextResponse.json({ error: "Invalid host or IP address" }, { status: 400 });
  }

  try {
    const command = buildCommand(testType as TestType, host);
    const { stdout, stderr } = await execAsync(command, {
      timeout: getTimeout(testType as TestType),
      shell: isWindows ? "cmd.exe" : "/bin/sh",
      maxBuffer: 1024 * 1024 * 10, // -> this is 10 MB
      encoding: "buffer",
    });
    return NextResponse.json({ output: decode(stdout) || decode(stderr) });
  } catch (err: any) {
    if (err.stdout) return NextResponse.json({ output: decode(err.stdout) });
    return NextResponse.json({ error: err.message || "Test failed" }, { status: 500 });
  }
}