import type { AttackStage } from "@/types";

export const ATTACK_STAGES: AttackStage[] = [
  {
    id: "injection",
    order: 1,
    title: "PHP Injection",
    shortLabel: "Injection",
    description: "File Upload, Parameter Injection, LFI/RFI",
    techniques: ["Unrestricted file upload", "LFI/RFI via include()", "PHAR deserialization", "SSTI"],
    detail:
      "The attacker finds an entry point where their data reaches a dangerous PHP sink: an upload handler that trusts filenames, a page parameter fed into include(), or user input rendered as template source. This is where untrusted data first crosses into the application's trust boundary.",
    colorFrom: "#3b82f6",
    colorTo: "#2563eb",
  },
  {
    id: "detection",
    order: 2,
    title: "Function Detection",
    shortLabel: "Detection",
    description: "shell_exec, system, exec, passthru",
    techniques: ["Probing disable_functions", "Identifying reachable sinks", "Testing for WAF/filter rules"],
    detail:
      "Having found an injection point, the attacker determines which command-execution primitives are actually callable in this environment. They test shell_exec, system, exec, passthru, proc_open and look for disable_functions restrictions, open_basedir limits, or WAF filtering that must be bypassed.",
    colorFrom: "#8b5cf6",
    colorTo: "#7c3aed",
  },
  {
    id: "execution",
    order: 3,
    title: "Shell Execution",
    shortLabel: "Execution",
    description: "Command execution as www-data",
    techniques: ["Reverse shell one-liners", "Web shell upload", "Interactive pty upgrade"],
    detail:
      "With a working sink confirmed, the attacker executes commands with the privileges of the web server process (typically www-data, apache, or nginx). They commonly drop a web shell for persistence or pivot directly to a reverse shell back to an attacker-controlled listener.",
    colorFrom: "#dc2626",
    colorTo: "#b91c1c",
  },
  {
    id: "privesc",
    order: 4,
    title: "Privilege Escalation",
    shortLabel: "Priv-Esc",
    description: "Kernel exploits, SUID, sudo",
    techniques: ["SUID binary abuse", "Misconfigured sudo rules", "Kernel exploits", "Writable cron jobs"],
    detail:
      "www-data rarely has the access an attacker wants. They enumerate SUID binaries, sudo -l output, writable files owned by root, and kernel version for known local-privilege-escalation exploits, aiming to move from a low-privilege web user to root or another high-value account.",
    colorFrom: "#ea580c",
    colorTo: "#c2410c",
  },
  {
    id: "persistence",
    order: 5,
    title: "Persistence",
    shortLabel: "Persistence",
    description: "Reverse shells, backdoors, cron jobs",
    techniques: ["Cron-based backdoors", "SSH authorized_keys", "Hidden web shells", "Scheduled reverse shells"],
    detail:
      "To survive a reboot or the original vulnerability being patched, the attacker plants durable access: a cron job that reconnects periodically, an SSH key added to authorized_keys, or additional web shells scattered across the filesystem.",
    colorFrom: "#be123c",
    colorTo: "#9f1239",
  },
];
