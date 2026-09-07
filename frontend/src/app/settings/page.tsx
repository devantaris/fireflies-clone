import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-full flex flex-col">
      <div className="border-b border-[#1e1e1e] px-6 py-4">
        <h1 className="text-xl font-semibold text-[#f0f0f0]">Settings</h1>
        <p className="text-xs text-[#666] mt-0.5">Workspace preferences</p>
      </div>

      <div className="flex-1 flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-[#2e2e2e] flex items-center justify-center mb-4 mx-auto">
            <Settings size={28} className="text-[#444]" />
          </div>
          <h3 className="text-base font-medium text-[#f0f0f0] mb-1">
            Settings coming soon
          </h3>
          <p className="text-sm text-[#666]">
            Profile, notifications, and integrations will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
