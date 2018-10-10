# AKS : Azure Managed Kubernetes

## Setup - run once

- Install Azure cli: `brew install azure-cli`
- Install Kubernetes (k8s) cli: `az acs kubernetes install-cli`
- Login: `az login`
- Set azure subscription:  `az account set --subscription DCD-CNP-DEV`
- Add to k8s cli (kubectl): `az aks get-credentials -n cnp-aks-cluster -g cnp-aks-rg`
- Optional: install kubectx: https://github.com/ahmetb/kubectx ::: this helps switching namespace and contexts

## Post-Setup

- Set context: `kubectl config use-context cnp-aks-cluster`
- Test by showing k8s nodes: `kubectl get nodes`. You should see something similar to: 
``` 
$ kubectl get nodes
NAME                       STATUS    ROLES     AGE       VERSION
aks-nodepool1-11596463-0   Ready     agent     9d        v1.11.2
aks-nodepool1-11596463-1   Ready     agent     9d        v1.11.2
aks-nodepool1-11596463-2   Ready     agent     9d        v1.11.2
aks-nodepool1-11596463-3   Ready     agent     9d        v1.11.2
aks-nodepool1-11596463-4   Ready     agent     9d        v1.11.2
```
- You're good to go!

## Tips

https://tools.hmcts.net/confluence/display/CNP/Using+Containers+in+the+Pipeline#UsingContainersinthePipeline-ManualDeleteScript

https://kubernetes.io/docs/reference/kubectl/cheatsheet/

```
kubectl config view                         # Show Merged kubeconfig settings.
kubectl config current-context              # Display the current-context
```
