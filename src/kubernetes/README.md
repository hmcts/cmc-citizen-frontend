# AKS : Azure Managed Kubernetes

## Setup - run once

- Install cli: `az acs kubernetes install-cli`
- Login: `az login`
- Set azure subscription:  `az account set --subscription DCD-CNP-DEV`
- Add to k8s cli (kubectl): `az aks get-credentials -n cnp-aks-cluster -g cnp-aks-rg`

## Post-Setup

- Set context: `kubectl config use-context cnp-aks-cluster`
- Test by showing k8s nodes: `kubectl get nodes`
- Show deployments, pods, services, ingress for CMC: `kubectl get deploy,po,svc,ing -n cmc`

## Tips

https://kubernetes.io/docs/reference/kubectl/cheatsheet/

```
kubectl config view                         # Show Merged kubeconfig settings.
kubectl config current-context              # Display the current-context
```
