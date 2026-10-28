export default function VerifyLoading() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-pulse">
      {/* Top Nav skeleton */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>

      {/* Main Card skeleton */}
      <div className="overflow-hidden border-2 border-slate-200 dark:border-slate-800 rounded-xl bg-card shadow-md">
        {/* Banner Skeleton */}
        <div className="p-8 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col items-center">
          <div className="h-6 w-64 bg-slate-300 dark:bg-slate-700 rounded mb-2" />
          <div className="h-3 w-96 max-w-full bg-slate-200 dark:bg-slate-700/60 rounded" />
        </div>

        {/* Body Skeleton */}
        <div className="p-6 sm:p-10 space-y-8">
          <div className="text-center space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="h-3 w-36 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
            <div className="h-8 w-60 bg-slate-300 dark:bg-slate-700 rounded mx-auto" />
            <div className="h-5 w-80 max-w-full bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
          </div>

          {/* 3-column metadata skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800" />
            <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800" />
            <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800" />
          </div>

          {/* Rubric criteria skeleton */}
          <div className="space-y-3">
            <div className="h-4 w-44 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-14 bg-slate-100 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800" />
            <div className="h-14 bg-slate-100 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800" />
            <div className="h-14 bg-slate-100 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
