#!/bin/sh

PORT="${1:-3001}"

PIDS="$(lsof -ti tcp:"$PORT" 2>/dev/null)"

if [ -z "$PIDS" ]; then
  echo "No dev server process found on port $PORT."
  exit 0
fi

kill -9 $PIDS
echo "Stopped dev server processes on port $PORT."
