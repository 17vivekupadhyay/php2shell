"use client";

import { useCallback, useState } from "react";
import { InjectionPoint, TargetFunction, ShellType, type SimulationResult } from "@/types";
import { simulatePayload } from "@/lib/payloads";

export function usePayload() {
  const [injectionPoint, setInjectionPoint] = useState<InjectionPoint>(InjectionPoint.GET_PARAM);
  const [targetFunction, setTargetFunction] = useState<TargetFunction>(TargetFunction.SHELL_EXEC);
  const [shell, setShell] = useState<ShellType>(ShellType.BASH);
  const [command, setCommand] = useState("id");
  const [result, setResult] = useState<SimulationResult | null>(null);

  const generate = useCallback(() => {
    setResult(simulatePayload(injectionPoint, targetFunction, shell, command));
  }, [injectionPoint, targetFunction, shell, command]);

  return {
    injectionPoint,
    setInjectionPoint,
    targetFunction,
    setTargetFunction,
    shell,
    setShell,
    command,
    setCommand,
    result,
    generate,
  };
}
