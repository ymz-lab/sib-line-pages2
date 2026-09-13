"use client";

import { useState, type FormEvent } from "react";

const categories = [
  "経営者コミュニティ",
  "企業向け実行支援",
  "SIB",
  "イベント",
  "協業・提携",
  "取材",
  "その他",
];

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    try {
      // TODO: 送信先エンドポイントを実装後に接続してください。
      await new Promise((resolve) => setTimeout(resolve, 900));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-accent-green/30 bg-accent-green/5 p-10 text-center">
        <p className="text-lg font-bold text-primary">お問い合わせありがとうございます。</p>
        <p className="mt-3 text-sm leading-relaxed text-primary/70">
          内容を確認のうえ、担当者よりご連絡いたします。今しばらくお待ちください。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="会社名" htmlFor="company" required>
          <input id="company" name="company" type="text" required className={inputClass} />
        </Field>
        <Field label="氏名" htmlFor="name" required>
          <input id="name" name="name" type="text" required className={inputClass} />
        </Field>
        <Field label="メールアドレス" htmlFor="email" required>
          <input id="email" name="email" type="email" required className={inputClass} />
        </Field>
        <Field label="電話番号（任意）" htmlFor="phone">
          <input id="phone" name="phone" type="tel" className={inputClass} />
        </Field>
      </div>

      <Field label="問い合わせ種別" htmlFor="category" required>
        <select id="category" name="category" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            選択してください
          </option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field label="問い合わせ本文" htmlFor="message" required>
        <textarea id="message" name="message" required rows={6} className={inputClass} />
      </Field>

      <label className="flex items-start gap-3 text-sm text-primary/70">
        <input
          type="checkbox"
          required
          className="mt-1 h-4 w-4 shrink-0 rounded border-primary/30 text-blue focus:ring-blue"
        />
        <span>個人情報の取り扱いに同意する</span>
      </label>

      {status === "error" && (
        <p className="text-sm font-medium text-accent-orange">
          送信に失敗しました。時間をおいて再度お試しください。
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-sm font-semibold text-white transition-colors hover:bg-blue disabled:opacity-60"
      >
        {status === "submitting" ? "送信中..." : "問い合わせを送信"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-primary/20 bg-white px-4 py-3 text-sm text-primary outline-none transition-colors focus:border-blue";

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-primary">
        {label}
        {required && <span className="ml-1 text-accent-orange">*</span>}
      </label>
      {children}
    </div>
  );
}
