#!/usr/bin/bash

while [ $# -gt 0 ]; do

   if [[ $1 == *"--"* ]]; then
        param="${1/--/}"
        declare $param="$2"
   fi

  shift
done

[ "$api-key" ] || echo "Script wasn't ran right. Usage: $0 --api-key [KEY] --webhook [URL]"
[ "$api-key" ] || exit 1

curl https://api.up.com.au/api/v1/webhooks \
  -XPOST \
  -H "Authorization: Bearer ${api_key}" \
  -H 'Content-Type: application/json' \
  --data-binary "{
    \"data\": {
      \"attributes\": {
        \"url\": \"${webhook}\",
        \"description\": \"Prod YNAB webhook\"
      }
    }
  }"
