#!/usr/bin/env bash
lsof -ni TCP | awk '/^idea.*\(LISTEN\)/ {system("lldb -p " $2 " -o \"call (int)close(" $4 ")\"")}'
