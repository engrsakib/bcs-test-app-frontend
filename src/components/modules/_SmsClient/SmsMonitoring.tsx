"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageSquare,
  RefreshCw,
  Send,
  ShieldAlert,
  Trash2,
  Wallet,
} from "lucide-react";
import { notify } from "@/lib/toast";
import { confirmAction } from "@/components/ui/confirm-dialog";
import {
  clearOtpBlock,
  fetchOtpBlockLogs,
  fetchOtpBlocks,
  fetchSmsBalance,
  fetchSmsLogs,
  fetchSmsStatus,
  sendTestSms,
  updateOtpConfig,
  type OtpBlockLogEntry,
  type OtpRateLimitBlock,
  type OtpRateLimitConfig,
  type SmsLogEntry,
  type SmsStatusData,
} from "@/lib/sms-api";

const DEFAULT_TEST_MESSAGE = "Your Cloudy BD OTP is 123456";

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

function formatMessageType(type: SmsLogEntry["message_type"]) {
  return type.replaceAll("_", " ");
}

export default function SmsMonitoring() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [status, setStatus] = useState<SmsStatusData | null>(null);
  const [smsLogs, setSmsLogs] = useState<SmsLogEntry[]>([]);
  const [otpBlockLogs, setOtpBlockLogs] = useState<OtpBlockLogEntry[]>([]);
  const [otpBlocks, setOtpBlocks] = useState<OtpRateLimitBlock[]>([]);
  const [otpConfig, setOtpConfig] = useState<OtpRateLimitConfig>({
    maxAttempts: 3,
    windowHours: 25,
  });
  const [testNumber, setTestNumber] = useState("");
  const [testMessage, setTestMessage] = useState(DEFAULT_TEST_MESSAGE);
  const [cleanupNumber, setCleanupNumber] = useState("");

  const loadAll = useCallback(async (showToast = false) => {
    try {
      setRefreshing(true);

      const [
        { data: statusResult },
        { data: balanceResult },
        { data: smsLogsResult },
        { data: blockLogsResult },
        { data: blocksResult },
      ] = await Promise.all([
        fetchSmsStatus(),
        fetchSmsBalance(),
        fetchSmsLogs(50),
        fetchOtpBlockLogs(50),
        fetchOtpBlocks(),
      ]);

      if (!statusResult.success || !statusResult.data) {
        throw new Error(statusResult.message || "Failed to load SMS status");
      }

      setStatus({
        ...statusResult.data,
        balance:
          balanceResult.data?.balance ??
          statusResult.data.balance ??
          null,
        connected:
          statusResult.data.connected && Boolean(balanceResult.data?.success),
      });

      setSmsLogs(smsLogsResult.data || []);
      setOtpBlockLogs(blockLogsResult.data || []);
      setOtpBlocks(blocksResult.data?.blocks || []);
      setOtpConfig(
        blocksResult.data?.config || {
          maxAttempts: 3,
          windowHours: 25,
        }
      );

      if (showToast) {
        notify.success("BulkSMS BD dashboard refreshed");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to refresh dashboard";
      notify.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleSendTest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!testNumber.trim()) {
      notify.error("Please enter a phone number");
      return;
    }

    try {
      setSending(true);

      const { ok, data: result } = await sendTestSms({
        number: testNumber.trim(),
        message: testMessage.trim(),
      });

      if (!ok || !result.success) {
        throw new Error(result.message || "Failed to send test SMS");
      }

      notify.success(result.message || "Test SMS sent successfully");
      await loadAll();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send test SMS";
      notify.error(message);
    } finally {
      setSending(false);
    }
  };

  const handleSaveConfig = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSavingConfig(true);

      const { ok, data: result } = await updateOtpConfig(otpConfig);

      if (!ok || !result.success || !result.data) {
        throw new Error(result.message || "Failed to update OTP config");
      }

      setOtpConfig(result.data);
      notify.success("OTP rate limit settings updated");
      await loadAll();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update OTP config";
      notify.error(message);
    } finally {
      setSavingConfig(false);
    }
  };

  const handleClearOne = async () => {
    if (!cleanupNumber.trim()) {
      notify.error("Enter a phone number to clear");
      return;
    }

    const confirmed = await confirmAction({
      title: "Clear OTP block?",
      description: `Remove Redis OTP limit for ${cleanupNumber.trim()}?`,
      confirmText: "Clear Number",
    });

    if (!confirmed) {
      return;
    }

    try {
      setClearing(true);

      const { ok, data: result } = await clearOtpBlock({
        phone_number: cleanupNumber.trim(),
      });

      if (!ok || !result.success) {
        throw new Error(result.message || "Failed to clear OTP block");
      }

      notify.success(
        result.message ||
          `Cleared ${result.data?.deleted_count || 0} Redis record(s)`
      );
      setCleanupNumber("");
      await loadAll();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to clear OTP block";
      notify.error(message);
    } finally {
      setClearing(false);
    }
  };

  const handleClearAll = async () => {
    const confirmed = await confirmAction({
      title: "Clear all OTP blocks?",
      description:
        "This will remove every OTP attempt counter from Redis. Users will be able to request OTP again immediately.",
      confirmText: "Clear All",
    });

    if (!confirmed) {
      return;
    }

    try {
      setClearing(true);

      const { ok, data: result } = await clearOtpBlock({ clear_all: true });

      if (!ok || !result.success) {
        throw new Error(result.message || "Failed to clear all OTP blocks");
      }

      notify.success(
        result.message ||
          `Cleared ${result.data?.deleted_count || 0} Redis record(s)`
      );
      await loadAll();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to clear all OTP blocks";
      notify.error(message);
    } finally {
      setClearing(false);
    }
  };

  const errorCodes = status?.error_codes
    ? Object.entries(status.error_codes).sort(
        ([codeA], [codeB]) => Number(codeA) - Number(codeB)
      )
    : [];

  const blockedCount = otpBlocks.filter((block) => block.is_blocked).length;

  return (
    <div className="min-h-screen w-full bg-white relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #10b981 100%)",
          backgroundSize: "100% 100%",
        }}
      />

      <div className="relative z-10 p-4 md:p-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-7 w-7 text-emerald-700" />
              BulkSMS BD Monitor
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor SMS, OTP Redis blocks, logs, and rate limit settings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadAll(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white/90 backdrop-blur border border-emerald-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Connection</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {loading
                    ? "Loading..."
                    : status?.connected
                      ? "Connected"
                      : "Issue Detected"}
                </p>
              </div>
              {status?.connected ? (
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              ) : (
                <AlertCircle className="h-8 w-8 text-amber-500" />
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white/90 backdrop-blur border border-emerald-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">SMS Balance</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {loading
                    ? "..."
                    : status?.balance != null
                      ? status.balance.toFixed(2)
                      : "N/A"}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-emerald-600" />
            </div>
          </div>

          <div className="rounded-2xl bg-white/90 backdrop-blur border border-emerald-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Redis Blocks</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {blockedCount}
                </p>
              </div>
              <ShieldAlert className="h-8 w-8 text-amber-600" />
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {otpBlocks.length} number(s) tracked in Redis
            </p>
          </div>

          <div className="rounded-2xl bg-white/90 backdrop-blur border border-emerald-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500">OTP Limit</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {otpConfig.maxAttempts} attempts / {otpConfig.windowHours} hours
            </p>
            <p className="text-sm text-gray-600 mt-3">
              Sender ID: {status?.sender_id || "N/A"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <form
            onSubmit={handleSaveConfig}
            className="rounded-2xl bg-white/90 backdrop-blur border border-emerald-100 p-5 shadow-sm space-y-4"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                OTP Rate Limit Settings
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Change how many OTP requests are allowed within the rolling
                window. Default is 3 attempts every 25 hours.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Attempts
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={otpConfig.maxAttempts}
                  onChange={(event) =>
                    setOtpConfig((current) => ({
                      ...current,
                      maxAttempts: Number(event.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Window (Hours)
                </label>
                <input
                  type="number"
                  min={1}
                  max={168}
                  value={otpConfig.windowHours}
                  onChange={(event) =>
                    setOtpConfig((current) => ({
                      ...current,
                      windowHours: Number(event.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingConfig}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {savingConfig ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Save OTP Settings
            </button>
          </form>

          <div className="rounded-2xl bg-white/90 backdrop-blur border border-emerald-100 p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Redis Cleanup
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Clear OTP attempt counters for one number or all numbers.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={cleanupNumber}
                onChange={(event) => setCleanupNumber(event.target.value)}
                placeholder="88017XXXXXXXX"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleClearOne}
                disabled={clearing}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-white hover:bg-amber-700 disabled:opacity-60"
              >
                {clearing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Clear This Number
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                disabled={clearing}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {clearing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Clear All Numbers
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/90 backdrop-blur border border-emerald-100 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Active Redis OTP Blocks
          </h2>
          <p className="text-sm text-gray-600 mt-1 mb-4">
            Current OTP attempt counters stored in Redis.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2 pr-4">Used</th>
                  <th className="py-2 pr-4">Remaining</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Reset At</th>
                </tr>
              </thead>
              <tbody>
                {otpBlocks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      No Redis OTP records found.
                    </td>
                  </tr>
                ) : (
                  otpBlocks.map((block) => (
                    <tr
                      key={block.phone_number}
                      className="border-b border-gray-100"
                    >
                      <td className="py-3 pr-4 font-medium text-gray-900">
                        {block.phone_number}
                      </td>
                      <td className="py-3 pr-4">
                        {block.attempts_used}/{block.max_attempts}
                      </td>
                      <td className="py-3 pr-4">
                        {block.remaining_attempts}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            block.is_blocked
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {block.is_blocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-600">
                        {formatDate(block.reset_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white/90 backdrop-blur border border-emerald-100 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">SMS Logs</h2>
            <p className="text-sm text-gray-600 mt-1 mb-4">
              Recent SMS send attempts stored in Redis.
            </p>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {smsLogs.length === 0 ? (
                <p className="text-sm text-gray-500">No SMS logs yet.</p>
              ) : (
                smsLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-gray-900">
                        {log.phone_number}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          log.success
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {log.success ? "Success" : "Failed"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {formatMessageType(log.message_type)} • Code{" "}
                      {log.response_code ?? "N/A"} • {formatDate(log.created_at)}
                    </p>
                    {log.error_message ? (
                      <p className="text-xs text-red-600 mt-1">
                        {log.error_message}
                      </p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white/90 backdrop-blur border border-emerald-100 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              OTP Block Logs
            </h2>
            <p className="text-sm text-gray-600 mt-1 mb-4">
              History of users blocked by OTP rate limiting.
            </p>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {otpBlockLogs.length === 0 ? (
                <p className="text-sm text-gray-500">No block logs yet.</p>
              ) : (
                otpBlockLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-gray-900">
                        {log.phone_number}
                      </p>
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                        Blocked
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {log.attempts_used}/{log.max_attempts} attempts •{" "}
                      {formatDate(log.created_at)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Reset at {formatDate(log.reset_at)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <form
            onSubmit={handleSendTest}
            className="rounded-2xl bg-white/90 backdrop-blur border border-emerald-100 p-5 shadow-sm space-y-4"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Send Test SMS
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Use format like 88017XXXXXXXX.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={testNumber}
                onChange={(event) => setTestNumber(event.target.value)}
                placeholder="88017XXXXXXXX"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={testMessage}
                onChange={(event) => setTestMessage(event.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send Test SMS
            </button>
          </form>

          <div className="rounded-2xl bg-white/90 backdrop-blur border border-emerald-100 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              BulkSMS BD Error Codes
            </h2>
            <p className="text-sm text-gray-600 mt-1 mb-4">
              Common response codes returned by the provider API.
            </p>

            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {errorCodes.map(([code, meaning]) => (
                <div
                  key={code}
                  className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                >
                  <span className="min-w-13 font-semibold text-emerald-700">
                    {code}
                  </span>
                  <span className="text-sm text-gray-700">{meaning}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
