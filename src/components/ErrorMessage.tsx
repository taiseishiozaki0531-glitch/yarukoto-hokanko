interface ErrorMessageProps {
  message: string;
  title?: string;
}

export function ErrorMessage({ message, title }: ErrorMessageProps) {
  return (
    <div
      className="min-w-0 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
      role="alert"
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <p className={title ? "mt-1 leading-6" : "leading-6"}>{message}</p>
    </div>
  );
}
