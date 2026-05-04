# Stage 1: Dependencies
FROM node:20-alpine AS deps
# --no-network বাদ দেওয়া হয়েছে কারণ Alpine রিপোজিটরি অনলাইন থেকে ডেটা নেয়
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
# অনেক ডিপেন্ডেন্সি থাকলে --legacy-peer-deps ব্যবহার করা নিরাপদ
RUN npm install --legacy-peer-deps

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

# প্রোডাকশন বিল্ড
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Standalone মোড ব্যবহারের জন্য কপি প্রসেস
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

# Standalone মোডে সার্ভার রান করার কমান্ড
CMD ["node", "server.js"]