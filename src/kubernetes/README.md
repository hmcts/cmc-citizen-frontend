# AKS : Azure Managed Kubernetes

## Setup - run once

- Install cli: `az acs kubernetes install-cli`
- Login: `az login`
- Set azure subscription:  `az account set --subscription DCD-CNP-DEV`
- Add to k8s cli (kubectl): `az aks get-credentials -n cnp-aks-cluster -g cnp-aks-rg`

## Post-Setup

- Set context: `kubectl config use-context cnp-aks-cluster`
- Test by showing k8s nodes: `kubectl get nodes`
- Show namespaces: `kubectl get ns`
- Show deployments, pods, services, ingress (namespace from above): `kubectl get deploy,po,svc,ing -n cmc-citizen-frontend-pr-XXX`

## Tips

https://tools.hmcts.net/confluence/display/CNP/Using+Containers+in+the+Pipeline#UsingContainersinthePipeline-ManualDeleteScript

https://kubernetes.io/docs/reference/kubectl/cheatsheet/

```
kubectl config view                         # Show Merged kubeconfig settings.
kubectl config current-context              # Display the current-context
```

## Known Issues

- Emails will include wrong domain - AAT claim-store is used as backend.
