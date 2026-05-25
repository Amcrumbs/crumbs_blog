"use client";

import { useFormState } from "react-dom";
import { Shield } from "lucide-react";
import { loginAdmin } from "@/app/admin/actions";

export function AdminLoginForm() {
  const [state, action] = useFormState(loginAdmin, null);

  return (
    <form action={action} className="surface mx-auto max-w-lg p-5">
      <div className="flex items-center gap-3">
        <Shield size={20} className="text-[var(--accent-strong)]" />
        <div>
          <h2 className="text-lg font-medium text-[var(--text)]">管理员登录</h2>
          <p className="mt-1 text-sm text-muted">登录后可以管理日志、笔记、导航和留言板。</p>
        </div>
      </div>
      <label className="mt-5 block">
        <span className="font-mono text-xs text-faint">ADMIN_PASSWORD</span>
        <input
          name="password"
          type="password"
          className="field mt-2 px-3 py-3"
          placeholder="输入管理员密码"
          required
        />
      </label>
      {state?.error ? <p className="mt-3 text-sm text-[var(--danger)]">{state.error}</p> : null}
      <button type="submit" className="button-primary mt-5 w-full px-4 py-3 text-sm">
        进入管理后台
      </button>
    </form>
  );
}
