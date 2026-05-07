#!/bin/bash

echo "======================================"
echo "  PDC-PROJECT - Parallel & Distributed"
echo "  Computing Load Balancer Setup"
echo "======================================"

# ── Start 3 Express Worker Processes (Parallel) ──────────────
echo "[PDC] Starting Worker 1 on port 3001..."
PORT=3001 node server.js &
W1_PID=$!

echo "[PDC] Starting Worker 2 on port 3002..."
PORT=3002 node server.js &
W2_PID=$!

echo "[PDC] Starting Worker 3 on port 3003..."
PORT=3003 node server.js &
W3_PID=$!

echo "[PDC] Workers started: PIDs $W1_PID, $W2_PID, $W3_PID"

# ── Wait for Workers to be Ready ─────────────────────────────
sleep 2

# ── Start Nginx Load Balancer ─────────────────────────────────
echo "[PDC] Starting Nginx Round Robin Load Balancer on port 80..."
nginx -g 'daemon off;'