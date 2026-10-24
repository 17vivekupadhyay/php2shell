import type { AttackStage } from "@/types";

export const ATTACK_STAGES: AttackStage[] = [
  {
    id: "injection",
    order: 1,
    title: "PHP Injection",
    shortLabel: "Injection",
    description: "File Upload, Parameter Injection, LFI/RFI",
    detail:
      "The attacker finds an entry point where their data reaches a dangerous PHP sink: an upload handler that trusts filenames, a page parameter fed into include(), or user input rendered as template source. This is where untrusted data first crosses into the application's trust boundary.",
    defenderNote:
      "Almost every stage after this one is preventable if this first crossing is stopped — allow-list validation here is the highest-leverage fix on this whole chain.",
    colorFrom: "#3b82f6",
    colorTo: "#2563eb",
    example: {
      vulnerable: `<?php
// upload.php
$target = __DIR__ . '/uploads/' . $_FILES['avatar']['name'];
move_uploaded_file($_FILES['avatar']['tmp_name'], $target);
// attacker uploads shell.php, then requests it directly`,
      secure: `<?php
// upload.php
$allowed = ['image/png' => 'png', 'image/jpeg' => 'jpg'];
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($_FILES['avatar']['tmp_name']);

if (!isset($allowed[$mime])) {
    http_response_code(400);
    exit('Unsupported file type');
}

$name = bin2hex(random_bytes(16)) . '.' . $allowed[$mime];
move_uploaded_file($_FILES['avatar']['tmp_name'], '/var/app/uploads_private/' . $name);`,
    },
    techniques: [
      {
        id: "upload",
        name: "Unrestricted file upload",
        detail: "An upload handler trusts the client-supplied filename or MIME type and stores the file in a web-accessible directory.",
        defense: "Validate file content (magic bytes), generate random server-side filenames, and store uploads outside the webroot.",
      },
      {
        id: "lfi",
        name: "Local/Remote File Inclusion",
        detail: "A page parameter controls which file is include()'d, letting path traversal or a remote URL pull in attacker-controlled PHP.",
        defense: "Never pass user input to include/require directly — map it through a hard-coded allow-list.",
      },
      {
        id: "phar",
        name: "PHAR deserialization",
        detail: "A crafted .phar file triggers PHP to unserialize object metadata the moment any filesystem function touches it via phar://.",
        defense: "Reject stream-wrapper prefixes before any filesystem call; validate paths with realpath() against a base directory.",
      },
      {
        id: "ssti",
        name: "Server-side template injection",
        detail: "User input is compiled as template source rather than passed as template data, letting Twig/Blade syntax reach PHP callables.",
        defense: "Only ever pass user data into a template's render variables — never into the template source string itself.",
      },
    ],
  },
  {
    id: "detection",
    order: 2,
    title: "Function Detection",
    shortLabel: "Detection",
    description: "shell_exec, system, exec, passthru",
    detail:
      "Having found an injection point, the attacker determines which command-execution primitives are actually callable in this environment. They test shell_exec, system, exec, passthru, proc_open and look for disable_functions restrictions, open_basedir limits, or WAF filtering that must be bypassed.",
    defenderNote:
      "disable_functions and open_basedir are real speed bumps here — they don't fix the injection, but they can turn a working exploit into a dead end.",
    colorFrom: "#8b5cf6",
    colorTo: "#7c3aed",
    example: {
      vulnerable: `; php.ini
disable_functions =
; nothing blocked — every execution primitive the attacker
; already found in stage 1 is callable as-is`,
      secure: `; php.ini
disable_functions = exec,system,shell_exec,passthru,popen,proc_open
open_basedir = /var/www/app:/tmp
disable_classes =
; a blocked function here stops stage 3 before it starts`,
      language: "ini",
    },
    techniques: [
      {
        id: "probe-disable-functions",
        name: "Probing disable_functions",
        detail: "The attacker calls each execution function in turn to see which ones php.ini has blocked for this host.",
        defense: "Disable every function the app doesn't need: exec, shell_exec, system, passthru, popen, proc_open.",
      },
      {
        id: "reachable-sinks",
        name: "Identifying reachable sinks",
        detail: "Beyond the obvious shell functions, attackers check mail(), dl(), and vulnerable extensions as alternate code-execution paths.",
        defense: "Pair disable_functions with disable_classes and a minimal extension list — don't rely on one layer alone.",
      },
      {
        id: "waf-bypass",
        name: "WAF / filter bypass testing",
        detail: "Blacklisted characters or function names are probed with encoding, concatenation, or $() / backtick substitution tricks.",
        defense: "Never rely on a blacklist of characters or function names — validate against an allow-list instead.",
      },
    ],
  },
  {
    id: "execution",
    order: 3,
    title: "Shell Execution",
    shortLabel: "Execution",
    description: "Command execution as www-data",
    detail:
      "With a working sink confirmed, the attacker executes commands with the privileges of the web server process (typically www-data, apache, or nginx). They commonly drop a web shell for persistence or pivot directly to a reverse shell back to an attacker-controlled listener.",
    defenderNote:
      "This is where least-privilege process isolation pays off — a www-data user that can't write to the webroot or reach the internal network limits everything downstream.",
    colorFrom: "#dc2626",
    colorTo: "#b91c1c",
    example: {
      vulnerable: `<?php
// ping.php
$host = $_GET['host'];
$output = shell_exec("ping -c 4 " . $host);
echo "<pre>$output</pre>";
// ?host=8.8.8.8;id  →  runs "id" as www-data too`,
      secure: `<?php
// ping.php
$host = $_GET['host'] ?? '';

if (!filter_var($host, FILTER_VALIDATE_IP)) {
    http_response_code(400);
    exit('Invalid host');
}

$output = shell_exec('ping -c 4 ' . escapeshellarg($host));
echo '<pre>' . htmlspecialchars($output ?? '') . '</pre>';`,
    },
    techniques: [
      {
        id: "web-shell",
        name: "Web shell upload",
        detail: "A small PHP script (file manager, command box) is dropped on disk for repeated, browser-based command execution.",
        defense: "Make the webroot read-only at deploy time and keep writable storage (uploads, cache) outside of it.",
      },
      {
        id: "reverse-shell",
        name: "Reverse shell one-liner",
        detail: "A single command (bash -i, nc, php -r) opens an outbound connection back to the attacker's listener for an interactive shell.",
        defense: "Restrict outbound (egress) traffic from app servers to only the destinations they legitimately need.",
      },
      {
        id: "pty-upgrade",
        name: "Interactive PTY upgrade",
        detail: "A bare reverse shell is upgraded to a full TTY (python -c 'pty.spawn...') for tab-completion and job control.",
        defense: "Egress filtering and command auditing/alerting catch this regardless of how polished the resulting shell is.",
      },
    ],
  },
  {
    id: "privesc",
    order: 4,
    title: "Privilege Escalation",
    shortLabel: "Priv-Esc",
    description: "Kernel exploits, SUID, sudo",
    detail:
      "www-data rarely has the access an attacker wants. They enumerate SUID binaries, sudo -l output, writable files owned by root, and kernel version for known local-privilege-escalation exploits, aiming to move from a low-privilege web user to root or another high-value account.",
    defenderNote:
      "A disciplined patch cadence directly removes exploits from this stage's toolbox — most local privesc chains rely on a known, already-fixed CVE.",
    colorFrom: "#ea580c",
    colorTo: "#c2410c",
    techniques: [
      {
        id: "suid-abuse",
        name: "SUID binary abuse",
        detail: "A world-executable binary with the setuid bit (an old backup tool, a misconfigured custom script) runs with owner privileges.",
        defense: "Audit SUID binaries regularly (find / -perm -4000) and remove the bit from anything that doesn't need it.",
      },
      {
        id: "sudo-misconfig",
        name: "Misconfigured sudo rules",
        detail: "sudo -l reveals a command the web user can run as root with no password — often broader than intended (e.g. a wildcard path).",
        defense: "Scope sudoers entries to exact binaries and arguments; avoid NOPASSWD and wildcards wherever possible.",
      },
      {
        id: "kernel-exploit",
        name: "Kernel exploits",
        detail: "An outdated kernel version matches a public local-privilege-escalation CVE with a ready-made exploit.",
        defense: "Keep the kernel and base OS patched on a regular, enforced cadence — don't let hosts drift.",
      },
      {
        id: "writable-cron",
        name: "Writable cron jobs",
        detail: "A cron script owned by root is writable by the web user, so editing it runs arbitrary code as root on its next trigger.",
        defense: "Audit file permissions on anything root's crontab executes; never leave scheduled scripts group/world-writable.",
      },
    ],
  },
  {
    id: "persistence",
    order: 5,
    title: "Persistence",
    shortLabel: "Persistence",
    description: "Reverse shells, backdoors, cron jobs",
    detail:
      "To survive a reboot or the original vulnerability being patched, the attacker plants durable access: a cron job that reconnects periodically, an SSH key added to authorized_keys, or additional web shells scattered across the filesystem.",
    defenderNote:
      "This is why patching the original hole is never the whole fix — a compromised host needs a full audit (cron, authorized_keys, webroot) before it's trusted again.",
    colorFrom: "#be123c",
    colorTo: "#9f1239",
    techniques: [
      {
        id: "cron-backdoor",
        name: "Cron-based backdoor",
        detail: "A scheduled task periodically re-establishes a reverse shell or re-downloads a payload, surviving process kills and reboots.",
        defense: "Diff crontabs against a known-good baseline and alert on unexpected entries.",
      },
      {
        id: "ssh-keys",
        name: "SSH authorized_keys",
        detail: "The attacker's public key is appended to a user's ~/.ssh/authorized_keys for durable, credential-free SSH access.",
        defense: "Monitor authorized_keys files for changes and disable password/key auth for accounts that don't need interactive SSH.",
      },
      {
        id: "scattered-shells",
        name: "Hidden web shells",
        detail: "Additional, less obvious web shells are dropped in multiple locations so removing one doesn't fully evict the attacker.",
        defense: "After any compromise, treat the entire webroot as untrusted and restore it from a known-clean source, not a partial cleanup.",
      },
    ],
  },
];
