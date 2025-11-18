export const XmlPreviewModal = ({ isOpen, xmlPreview, onChange, onCancel, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl max-w-3xl w-full mx-4 p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-slate-900">Review XML</h2>
        <textarea
          className="border border-slate-200 rounded-lg px-3 py-2 min-h-[260px] font-mono text-sm w-full bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 autosize-textarea"
          value={xmlPreview}
          onChange={onChange}
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={onConfirm}
          >
            Copy to clipboard
          </button>
        </div>
      </div>
    </div>
  )
}
