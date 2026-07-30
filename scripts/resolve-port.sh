#!/bin/sh

engine="${1:-none}"
requested_port="${2:-8080}"

case "$requested_port" in
  ''|*[!0-9]*)
    echo "PORT must be a number between 1 and 65535." >&2
    exit 1
    ;;
esac

if [ "$requested_port" -lt 1 ] || [ "$requested_port" -gt 65535 ]; then
  echo "PORT must be a number between 1 and 65535." >&2
  exit 1
fi

current_compose_port=""
if [ "$engine" != "none" ] && command -v "$engine" >/dev/null 2>&1; then
  compose_binding="$("$engine" compose port web 80 2>/dev/null || true)"
  if [ -n "$compose_binding" ]; then
    current_compose_port="${compose_binding##*:}"
  fi
fi

port_is_listening() {
  if command -v lsof >/dev/null 2>&1; then
    lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1
    return
  fi
  if command -v nc >/dev/null 2>&1; then
    nc -z 127.0.0.1 "$1" >/dev/null 2>&1
    return
  fi
  return 1
}

port_is_available() {
  [ "$1" = "$current_compose_port" ] || ! port_is_listening "$1"
}

offset=0
while [ "$offset" -le 100 ]; do
  higher=$((requested_port + offset))
  if [ "$higher" -le 65535 ] && port_is_available "$higher"; then
    echo "$higher"
    exit 0
  fi

  if [ "$offset" -gt 0 ]; then
    lower=$((requested_port - offset))
    if [ "$lower" -ge 1 ] && port_is_available "$lower"; then
      echo "$lower"
      exit 0
    fi
  fi
  offset=$((offset + 1))
done

echo "No available port found near $requested_port." >&2
exit 1
