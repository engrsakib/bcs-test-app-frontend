"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageSquare,
  RefreshCw,
  Send,
  Wallet,
} from "lucide-react";
import { notify } from "@/lib/toast";
import {
  fetchSmsBalance,
  fetchSmsStatus,
  sendTestSms,
  type SmsStatusData,
} from "@/lib/sms-api";

const DEFAULT_TEST_MESSAGE = "Your Cloudy BD OTP is 123456";

export default function SmsMonitoring() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<SmsStatusData | null>(null);
  const [testNumber, setTestNumber] = useState("");
  const [testMessage, setTestMessage] = useState(DEFAULT_TEST_MESSAGE);

  const loadStatus = useCallback(async (showToast = false) => {
    try {
      setRefreshing(true);

      const [{ data: statusResult }, { data: balanceResult }] =
        await Promise.all([fetchSmsStatus(), fetchSmsBalance()]);

      if (!statusResult.success || !statusResult.data) {
        throw new Error(statusResult.message || "Failed to load SMS status");
      }

      const mergedStatus: SmsStatusData = {
        ...statusResult.data,
        balance:
          balanceResult.data?.balance ??
          statusResult.data.balance ??
          null,
        connected:
          statusResult.data.connected && Boolean(balanceResult.data?.success),
      };

      setStatus(mergedStatus);

      if (showToast) {
        notify.success("BulkSMS BD status refreshed");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load SMS status";
      notify.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

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
      await loadStatus();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send test SMS";
      notify.error(message);
    } finally {
      setSending(false);
    }
  };

  const errorCodes = status?.error_codes
    ? Object.entries(status.error_codes).sort(
        ([codeA], [codeB]) => Number(codeA) - Number(codeB)
      )
    : [];

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
              Check balance, connection status, and send a test SMS.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadStatus(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh Status
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/90 backdrop-blur border border-emerald-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Connection</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {loading ? "Loading..." : status?.connected ? "Connected" : "Issue Detected"}
                </p>
              </div>
              {status?.connected ? (
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              ) : (
                <AlertCircle className="h-8 w-8 text-amber-500" />
              )}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {status?.message || "Checking provider connection..."}
            </p>
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
            <p className="text-sm text-gray-600 mt-3">
              Response code: {status?.response_code ?? "N/A"}
            </p>
          </div>

          <div className="rounded-2xl bg-white/90 backdrop-blur border border-emerald-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Configuration</p>
            <div className="mt-2 space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-medium">Provider:</span>{" "}
                {status?.provider || "BulkSMS BD"}
              </p>
              <p>
                <span className="font-medium">Sender ID:</span>{" "}
                {status?.sender_id || "N/A"}
              </p>
              <p className="break-all">
                <span className="font-medium">API URL:</span>{" "}
                {status?.base_url || "N/A"}
              </p>
              <p>
                <span className="font-medium">Last checked:</span>{" "}
                {status?.last_checked_at
                  ? new Date(status.last_checked_at).toLocaleString()
                  : "N/A"}
              </p>
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
                Use format like 88017XXXXXXXX. OTP format is recommended by
                BulkSMS BD.
              </p>
            </div>

            <div>
              <label
                htmlFor="test-number"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                id="test-number"
                type="text"
                value={testNumber}
                onChange={(event) => setTestNumber(event.target.value)}
                placeholder="88017XXXXXXXX"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="test-message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="test-message"
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

            <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
              {errorCodes.map(([code, meaning]) => (
                <div
                  key={code}
                  className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                >
                  <span className="min-w-[52px] font-semibold text-emerald-700">
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
