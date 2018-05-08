#!/usr/bin/env bash
lsof -ni TCP | \
  awk '{split($9,a,":"); if ($1 == "idea" && a[2] > 50000 && $10 == "(LISTEN)") { system("lldb -p " $2 " -o \"call (int)close(" $4 ")\"")} }'
