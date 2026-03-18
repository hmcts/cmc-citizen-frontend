{{/*
Compatibility shim for Bitnami chart template naming drift.

Some nested charts (e.g. cmc-claim-store -> java -> postgresql) reference the
helper: "postgresql.readReplicas.createExtendedConfigmap"

Newer Bitnami postgresql charts define the same helper under:
  "postgresql.v1.readReplicas.createExtendedConfigmap"

During `helm lint`, the missing helper causes:
  "template: no template postgresql.readReplicas.createExtendedConfigmap"

By defining the legacy helper name here, we unblock templating without
modifying the downloaded dependency subchart.
*/}}
{{- define "postgresql.readReplicas.createExtendedConfigmap" -}}
{{- /* This template is only used as a boolean gate by Bitnami's
       templates/read/extended-configmap.yaml (it does not render the configmap itself). */ -}}
{{- if .Values.readReplicas.extendedConfiguration -}}
true
{{- end -}}
{{- end -}}

{{/*
Some nested Bitnami-postgresql versions expect a helper called `postgresql.port`
that reads `.Values.service.port`. In some of our nested charts that value is
missing, causing:
  nil pointer evaluating interface {}.port

Defining the helper here makes Helm templating resilient and defaults to
5432 (the Bitnami chart default).
*/}}
{{- define "postgresql.port" -}}
{{- if and .Values.service (hasKey .Values.service "port") -}}
{{- $port := (index .Values.service "port") -}}
{{- if $port -}}
{{ $port }}
{{- else -}}
5432
{{- end -}}
{{- else -}}
5432
{{- end -}}
{{- end -}}
