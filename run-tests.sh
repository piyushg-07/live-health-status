#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:4000"

echo "→ Logging in…"
# Capture both body and status
LOGIN_RAW=$(curl -s -w "\n%{http_code}" -X POST "$BASE/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}')
HTTP_STATUS=$(echo "$LOGIN_RAW" | tail -n1)
LOGIN_BODY=$(echo "$LOGIN_RAW" | sed '$d')

if [[ "$HTTP_STATUS" -ne 200 ]]; then
  echo "❌ Login failed (HTTP $HTTP_STATUS):"
  echo "$LOGIN_BODY"
  exit 1
fi

TOKEN=$(echo "$LOGIN_BODY" | jq -r .token)
echo "✔ Token: $TOKEN"

# — Create
echo "→ Creating a record…"
CREATE_RAW=$(curl -s -w "\n%{http_code}" -X POST "$BASE/records" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Automated","age":50,"status":"Healthy"}')
CREATE_STATUS=$(echo "$CREATE_RAW" | tail -n1)
CREATE_BODY=$(echo "$CREATE_RAW" | sed '$d')

if [[ "$CREATE_STATUS" -ne 201 ]]; then
  echo "❌ Create failed (HTTP $CREATE_STATUS):"
  echo "$CREATE_BODY"
  exit 1
fi

echo "✔ Create →" "$(echo "$CREATE_BODY" | jq .)"
ID=$(echo "$CREATE_BODY" | jq -r .id)

# — Read
echo "→ Reading record $ID…"
READ_RAW=$(curl -s -w "\n%{http_code}" -X GET "$BASE/records/$ID" \
  -H "Authorization: Bearer $TOKEN")
READ_STATUS=$(echo "$READ_RAW" | tail -n1)
READ_BODY=$(echo "$READ_RAW" | sed '$d')

if [[ "$READ_STATUS" -ne 200 ]]; then
  echo "❌ Read failed (HTTP $READ_STATUS):"
  echo "$READ_BODY"
  exit 1
fi

echo "✔ Read →" "$(echo "$READ_BODY" | jq .)"

# — Update
echo "→ Updating record $ID…"
UPDATE_RAW=$(curl -s -w "\n%{http_code}" -X PUT "$BASE/records/$ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"Critical"}')
UPDATE_STATUS=$(echo "$UPDATE_RAW" | tail -n1)
UPDATE_BODY=$(echo "$UPDATE_RAW" | sed '$d')

if [[ "$UPDATE_STATUS" -ne 200 ]]; then
  echo "❌ Update failed (HTTP $UPDATE_STATUS):"
  echo "$UPDATE_BODY"
  exit 1
fi

echo "✔ Update →" "$(echo "$UPDATE_BODY" | jq .)"

# — Delete
echo "→ Deleting record $ID…"
DELETE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE/records/$ID" \
  -H "Authorization: Bearer $TOKEN")

if [[ "$DELETE_STATUS" -ne 204 ]]; then
  echo "❌ Delete failed (HTTP $DELETE_STATUS)"
  exit 1
fi

echo "✔ Delete → Status: $DELETE_STATUS"
echo "🎉 All API tests passed!"
