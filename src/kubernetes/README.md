# AKS : Azure Managed Kubernetes

## Setup

- Install cli: `az acs kubernetes install-cli`
- Loging: `az login`
- Set azure subscription:  `az account set --subscription DCD-CNP-DEV`
- Add to k8s cli (kubectl): `az aks get-credentials -n cnp-aks-cluster -g cnp-aks-rg`
- Test by showing k8s nodes: `kubectl get nodes`
- Show deployments, pods, services, ingress for CMC: `kubectl get deploy,po,svc,ing -n cmc`
