export enum InjectionPoint {
  FILE_UPLOAD = "file_upload",
  GET_PARAM = "get_param",
  POST_DATA = "post_data",
  COOKIE = "cookie",
  HTTP_HEADER = "http_header",
  SQL_INJECTION = "sql_injection",
}

export enum TargetFunction {
  SHELL_EXEC = "shell_exec",
  SYSTEM = "system",
  EXEC = "exec",
  PASSTHRU = "passthru",
  PROC_OPEN = "proc_open",
  POPEN = "popen",
}

export enum ShellType {
  BASH = "bash",
  SH = "sh",
  ZSH = "zsh",
  POWERSHELL = "powershell",
}

export interface InjectionPointInfo {
  id: InjectionPoint;
  label: string;
  description: string;
  entrySnippet: string;
}

export interface TargetFunctionInfo {
  id: TargetFunction;
  label: string;
  description: string;
  signature: string;
  returnsOutput: boolean;
}

export interface SimulationResult {
  injectionPoint: InjectionPoint;
  targetFunction: TargetFunction;
  shell: ShellType;
  command: string;
  generatedPayload: string;
  vulnerablePhpSnippet: string;
  simulatedOutput: string;
  impactExplanation: string;
  bypassNotes?: string[];
}
