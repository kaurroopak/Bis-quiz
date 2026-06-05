import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function SubmissionModal({
  questions,
  answers,
  reviews,
  reviewTimesMap = {}, // CORRECTED: Explicit default prevents reading values from uninitialized object fields
  visited,
  onClose,
  onSubmitConfirm,
}) {
  const [inputLock, setInputLock] = useState("");
  const [executing, setExecuting] = useState(false);

  const attempted = questions.filter((q) => answers[q.id]).length;

  // Loops and calculates total telemetry count vectors cleanly
  const totalReviewClicks = questions.reduce((accum, q) => {
    return accum + (Number(reviewTimesMap[q.id]) || 0);
  }, 0);

  const pending = questions.filter(
    (q) => visited[q.id] && !answers[q.id],
  ).length;
  const unvisited = questions.filter((q) => !visited[q.id]).length;

  const handleFinalConfirm = async (e) => {
    e.preventDefault();
    if (inputLock !== "SUBMIT" || executing) return;

    try {
      setExecuting(true);
      await onSubmitConfirm("SUBMIT");
    } catch (err) {
      console.error("Modal execution fault:", err);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xl font-sans text-xs text-slate-600">
        {/* MODAL HEADER */}
        <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600 font-bold tracking-wide uppercase">
            <AlertTriangle className="w-4 h-4 animate-pulse" /> Confirm Final
            Submission
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ANALYTICS SNAPSHOT PANEL */}
        <div className="p-5 space-y-4">
          <p className="text-slate-500 leading-relaxed font-medium">
            Review your structural response mapping blueprint. Once committed,
            options are permanently logged and sealed:
          </p>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-2 font-medium">
            <div className="flex justify-between text-slate-700">
              <span>Total Catalog items</span>
              <span className="font-bold">{questions.length}</span>
            </div>
            <hr className="border-slate-200/60" />
            <div className="flex justify-between text-emerald-700">
              <span>Answered Alternatives</span>
              <span className="font-bold">{attempted}</span>
            </div>
            <div className="flex justify-between text-amber-700">
              <span>Total Review Click Events</span>
              <span className="font-bold text-sm font-mono">
                {totalReviewClicks}
              </span>
            </div>
            <div className="flex justify-between text-rose-700">
              <span>Skipped/Unanswered Items</span>
              <span className="font-bold">{pending}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Unvisited Matrix Registers</span>
              <span>{unvisited}</span>
            </div>
          </div>

          {/* VERIFICATION BAR */}
          <form onSubmit={handleFinalConfirm} className="space-y-3 pt-1">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                Security Lock Verification
              </label>
              <input
                type="text"
                required
                value={inputLock}
                onChange={(e) => setInputLock(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white rounded-lg p-2 text-center text-xs tracking-widest font-mono font-bold uppercase outline-none transition text-rose-600 placeholder:text-slate-400 placeholder:tracking-normal placeholder:font-sans placeholder:font-normal"
                placeholder='Type "SUBMIT" to confirm'
                disabled={executing}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={executing}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-bold py-2 rounded-lg text-xs tracking-wide transition uppercase text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={inputLock !== "SUBMIT" || executing}
                className="bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-30 disabled:pointer-events-none font-bold py-2 rounded-lg text-xs tracking-wider transition uppercase shadow-sm text-center"
              >
                {executing ? "Sealing..." : "Seal & Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
